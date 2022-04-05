const Public = require("model/public");
const redisCache = require("lib/cache");
const { CACHE_PUBLIC_TREND, CACHE_PUBLIC_VOTE, CACHE_PUBLIC_COMMENT } = require("model/constant");

const publicDataController = {
	get: {
		trend: getTrend, //publicTrend,
		vote: getVote, //publicVote,
		comment: getComment, //publicComment,
	},
};

async function getTrend() {
	const cache = await redisCache.get(CACHE_PUBLIC_TREND);
	if (cache) return cache;

	const result = await Public.getTrend();
	redisCache.set(CACHE_PUBLIC_TREND, result);
	return result;
}

async function getVote() {
	const cache = await redisCache.get(CACHE_PUBLIC_VOTE);
	if (cache) return cache;

	const result = (await Public.getVote())
		.map((val) => ({
			...val,
			change: (((val.MAX - val.MIN) / val.MIN) * 100) << 0,
		}))
		.sort((a, b) => b.change - a.change);
	redisCache.set(CACHE_PUBLIC_VOTE, result);
	return result;
}

async function getComment() {
	const cache = await redisCache.get(CACHE_PUBLIC_COMMENT);
	if (cache) return cache;

	const result = (await Public.getComment())
		.map((val) => ({
			...val,
			change: (((val.MAX - val.MIN) / val.MIN) * 100) << 0,
		}))
		.sort((a, b) => b.change - a.change);
	redisCache.set(CACHE_PUBLIC_COMMENT, result);
	return result;
}

async function setCache() {
	await redisCache.del([CACHE_PUBLIC_COMMENT, CACHE_PUBLIC_VOTE, CACHE_PUBLIC_TREND]);
	getComment();
	getVote();
	getTrend();
}

setCache();
setInterval(setCache, 1000 * 60 * 30);

module.exports = publicDataController;
