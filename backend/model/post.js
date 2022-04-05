const knex = require("knexFile");
const { THREAD, THREAD_STAT } = require("model/constant");

module.exports.getThread = (forum, start, end, limit) => knex.select("*").from(THREAD).limit(limit).where(forum).whereBetween("created", [start, end]).orderBy("created", "desc");
module.exports.getThreadsStatBySymbol = (symbol, limit) => knex.select("*").from(THREAD_STAT).where("id", symbol).limit(limit).orderBy("updated", "desc");
module.exports.getLastestThreadStat = (forum, start, end, limit) =>
	knex
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

module.exports.getAllThreadStat = (forum, minComment, minVote, limit, start, end) =>
	knex
		.select(`${THREAD_STAT}.*`, `${THREAD}.title`)
		.from(THREAD_STAT)
		.join(THREAD, `${THREAD_STAT}.id`, "=", `${THREAD}.id`)
		.limit(limit)
		.where(forum)
		.andWhere("vote", ">", minVote)
		.andWhere("comment", ">", minComment)
		.whereBetween("updated", [start, end])
		.orderBy("updated", "desc");

module.exports.saveThreadsStat = (thread) => knex(THREAD_STAT).insert(thread).returning("id");
module.exports.saveThreads = (threads, ids) =>
	knex(THREAD)
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
