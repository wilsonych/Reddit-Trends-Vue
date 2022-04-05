const knex = require("knexFile");
const moment = require("moment");
const THREAD = "THREAD";
const THREAD_STAT = "THREAD_STAT";

function timeFormat(date) {
	const duration = moment.duration(30, "minutes");
	return moment(Math.ceil(+date / +duration) * +duration).valueOf();
}

module.exports.getTrend = () =>
	knex
		.select(`${THREAD_STAT}.*`, `${THREAD}.title`)
		.from(THREAD_STAT)
		.join(THREAD, `${THREAD_STAT}.id`, "=", `${THREAD}.id`)
		.limit(1000)
		.where("vote", ">", 50)
		.andWhere("comment", ">", 50)
		.whereBetween("updated", [new Date(timeFormat(Date.now() - 604800000)), new Date(timeFormat(Date.now()))])
		.orderBy("updated", "desc");

module.exports.getVote = () =>
	knex
		.select(`${THREAD}.title`, `${THREAD}.forum`, "t1.*")
		.from(
			knex
				.select("id", knex.raw("max(??) as max", ["vote"]), knex.raw("min(??) as min", ["vote"]))
				.from(THREAD_STAT)
				.where("vote", ">", 50)
				.whereBetween("updated", [new Date(timeFormat(Date.now() - 86400000)), new Date(timeFormat(Date.now()))])
				.groupBy("id")
				.as("t1")
		)
		.join(THREAD, `t1.id`, "=", `${THREAD}.id`);

module.exports.getComment = () =>
	knex
		.select(`${THREAD}.title`, `${THREAD}.forum`, "t1.*")
		.from(
			knex
				.select("id", knex.raw("max(??) as max", ["comment"]), knex.raw("min(??) as min", ["comment"]))
				.from(THREAD_STAT)
				.where("comment", ">", 50)
				.whereBetween("updated", [new Date(timeFormat(Date.now() - 86400000)), new Date(timeFormat(Date.now()))])
				.groupBy("id")
				.as("t1")
		)
		.join(THREAD, `t1.id`, "=", `${THREAD}.id`);
