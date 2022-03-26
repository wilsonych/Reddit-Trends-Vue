var cacheManager = require('cache-manager');
var cache = cacheManager.caching({store: 'memory', max: 100, ttl: 3600});

module.exports = cache;