var cacheManager = require("cache-manager");
var redisStore = require("cache-manager-redis");

var redisCache = cacheManager.caching({
	store: redisStore,
	url: "redis://redis:6379",
	ttl: 3600,
});

redisCache.store.events.on('redisError', function(error) {
	console.log(error);
});

module.exports = redisCache;
