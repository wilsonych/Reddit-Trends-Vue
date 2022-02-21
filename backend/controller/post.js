const knex = require("knexFile");
const verifier = require("lib/verifier");

const THREAD = "THREAD";
const THREAD_STAT = "THREAD_STAT";

const postController = {
    get: {
        post: getThreads,
        lastest: getLatestThreadsStat,
        trend: getThreadsStat,
        trendSymbol: getThreadsStatBySymbol,
    },
    post: {
        threadsStat: saveThreadsStat,
        threads: saveThreads,
    },
};

function getQueryFromReq(req) {
    const forum = req.query.forum ? { forum: req.query.forum } : {};
    const start = req.query.start || 0;
    const end = req.query.end || Date.now();
    const limit = req.query.limit || 2000;
    const minVote = req.query.minVote || 50;
    const minComment = req.query.minComment || 50;
    const symbol = req.query.symbol || "";
    return { forum: forum, start: new Date(parseInt(start)), end: new Date(parseInt(end)), limit: limit, minVote: minVote, minComment: minComment, symbol: symbol };
}

/**
 * @description Get Stat about post (name, created at...)
 */
async function getThreads(req) {
    const { forum, start, end, limit } = getQueryFromReq(req);
    return knex.select("*").from(THREAD).limit(limit).where(forum).whereBetween("created", [start, end]).orderBy("created", "desc");
}

/**
 * @description Get the latest Stat of each post in the database(vote and comment)
 */
async function getLatestThreadsStat(req) {
    const { forum, start, end, limit } = getQueryFromReq(req);
    return knex
        .select("*")
        .from(
            knex
                .select("A.id", "A.vote", "A.comment", "A.updated")
                .from(
                    knex
                        .select("id", knex.raw("max(??) as updated", ["updated"]))
                        .from(THREAD_STAT)
                        .where(forum)
                        .whereBetween("updated", [start, end])
                        .groupBy("id")
                        .as("B")
                )
                .join(`${THREAD_STAT} as A`, function () {
                    this.on("A.id", "=", "B.id").andOn("A.updated", "=", "B.UPDATED");
                })
                .as("C")
        )
        .join(`${THREAD} as D`, "D.id", "=", "C.id")
        .where(forum)
        .limit(limit);
}

/**
 * @description Get the trend(vote and comment), the period of trend is limited by the quantity not time
 */
async function getThreadsStat(req) {
    const { forum, minComment, minVote, limit, start, end } = getQueryFromReq(req);
    return knex
        .select("*")
        .from(THREAD_STAT)
        .limit(limit)
        .where(forum)
        .andWhere("vote", ">", minVote)
        .andWhere("comment", ">", minComment)
        .whereBetween("updated", [start, end])
        .orderBy("updated", "desc");
}

/**
 * @description Get the trend(vote and comment) of a specified post
 */
async function getThreadsStatBySymbol(req) {
    verifier.atLeast(["symbol"], req.query);
    const { symbol, limit } = getQueryFromReq(req);
    return knex.select("*").from(THREAD_STAT).where("id", symbol).limit(limit).orderBy("updated", "desc");
}

async function saveThreadsStat(req) {
    verifier.atLeast(["thread"], req.body);
    const thread = req.body.thread.map((x) => ({ ...x, updated: new Date(x.updated) }));
    return knex(THREAD_STAT).insert(thread).returning("id");
}

async function saveThreads(req) {
    verifier.atLeast(["thread"], req.body);
    const threads = req.body.thread;
    const ids = threads.map((x) => x.id);
    return await knex(THREAD)
        .select("id")
        .whereIn("id", ids)
        .then((rows) => {
            const existIds = rows.map((x) => x.id);
            const threadsNotExist = threads.filter((thread) => !existIds.includes(thread.id)).map((x) => ({ ...x, created: new Date(x.created) }));
            if (threadsNotExist.length) {
                return knex(THREAD).insert(threadsNotExist).returning("id");
            } else {
                return [];
            }
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
}

module.exports = postController;
