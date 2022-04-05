const knex = require("knexFile");
const redisCache = require("lib/cache");
const { CACHE_COUNT_FORUM, CACHE_COUNT_UPDATE, CACHE_COUNT_POST, CACHE_COUNT_TREND, THREAD, THREAD_STAT } = require("model/constant");

const countController = {
	get: {
		forum: forum,
		last: lastUpdated,
		post: postCount,
		post_trend: postTrendCount,
	},
};

async function forum() {
	const cache = await redisCache.get(CACHE_COUNT_FORUM);
	if (cache) return cache;
	return knex
		.select("forum", knex.raw('count(??) as "count"', ["forum"]))
		.from(THREAD)
		.groupBy("forum")
		.then((result) => {
			redisCache.set(CACHE_COUNT_FORUM, result);
			return result;
		});
}

async function lastUpdated() {
	return knex(THREAD_STAT)
		.max({ updated: "updated" })
		.then((result) => result[0].updated);
}

async function postCount() {
	const cache = await redisCache.get(CACHE_COUNT_POST);
	if (cache) return cache;
	return knex(THREAD)
		.count("*", { as: "a" })
		.then((result) => result[0].a)
		.then((result) => {
			redisCache.set(CACHE_COUNT_POST, result);
			return result;
		});
}

async function postTrendCount() {
	const cache = await redisCache.get(CACHE_COUNT_TREND);
	if (cache) return cache;
	return knex(THREAD_STAT)
		.count("*", { as: "a" })
		.then((result) => result[0].a)
		.then((result) => {
			redisCache.set(CACHE_COUNT_TREND, result);
			return result;
		});
}

async function setCache() {
	await redisCache.del([CACHE_COUNT_TREND, CACHE_COUNT_POST, CACHE_COUNT_FORUM]);
	forum();
	postCount();
	postTrendCount();
}

setCache();
setInterval(setCache, 1000 * 60 * 30);

module.exports = countController;
