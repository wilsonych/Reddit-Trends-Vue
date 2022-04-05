const verifier = require("lib/verifier");
const moment = require("moment");
const Post = require("model/post");
const LOG = require("lib/log");
const redisCache = require("lib/cache");
const { CACHE_THREAD, CACHE_THREAD_STAT } = require("model/constant");

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

function timeFormat(date) {
	const duration = moment.duration(30, "minutes");
	return moment(Math.ceil(+date / +duration) * +duration).valueOf();
}

function getQueryFromReq(req) {
	const forum = req.query.forum ? { forum: req.query.forum } : {};
	const start = timeFormat(req.query.start || 0);
	const end = timeFormat(req.query.end || Date.now());
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
	return Post.getThread(forum, start, end, limit);
}

/**
 * @description Get the latest Stat of each post in the database(vote and comment)
 */
async function getLatestThreadsStat(req) {
	const { forum, start, end, limit } = getQueryFromReq(req);
	if (req.query.cache === "true") {
		const cache = await redisCache.get(CACHE_THREAD_STAT);
		if (cache) return cache;
	}
	return Post.getLastestThreadStat(forum, start, end, limit);
}

/**
 * @description Get the trend(vote and comment), the period of trend is limited by the quantity not time
 */
async function getThreadsStat(req) {
	const { forum, minComment, minVote, limit, start, end } = getQueryFromReq(req);
	if (req.query.cache === "true") {
		const cache = await redisCache.get(CACHE_THREAD);
		if (cache) return cache;
	}
	return Post.getAllThreadStat(forum, minComment, minVote, limit, start, end);
}

/**
 * @description Get the trend(vote and comment) of a specified post
 */
async function getThreadsStatBySymbol(req) {
	verifier.atLeast(["symbol"], req.query);
	const { symbol, limit } = getQueryFromReq(req);
	return Post.getThreadsStatBySymbol(symbol, limit);
}

async function saveThreadsStat(req) {
	verifier.atLeast(["thread"], req.body);
	const thread = req.body.thread.map((x) => ({ ...x, updated: new Date(x.updated) }));
	return Post.saveThreadsStat(thread);
}

async function saveThreads(req) {
	verifier.atLeast(["thread"], req.body);
	const threads = req.body.thread;
	const ids = threads.map((x) => x.id);
	return Post.saveThreads(threads, ids);
}

async function setCache() {
	await redisCache.del([CACHE_THREAD,CACHE_THREAD_STAT]);
	const start = new Date(timeFormat(Date.now() - 604800000));
	const end = new Date(timeFormat(Date.now()));
	Promise.all([Post.getAllThreadStat({}, 100, 100, 2000, start, end), Post.getLastestThreadStat({}, start, end, 2000)])
		.then((cache) => {
			LOG("getAllThreadStat and getLastestThreadStat setted");
			redisCache.set(CACHE_THREAD, cache[0]);
			redisCache.set(CACHE_THREAD_STAT, cache[1]);
		})
		.catch((err) => console.log(err));
}

setCache();
setInterval(setCache, 1000 * 60 * 30);

module.exports = postController;
