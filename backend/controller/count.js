const knex = require("knexFile")

const THREAD = "THREAD"
const THREAD_DETAIL = "THREAD_STAT"

const countController = {
    get: {
        forum: forum,
        last: lastUpdated,
        post: postCount,
        post_trend: postTrendCount
    },
    
}



async function forum() {
    return knex.select("forum", knex.raw('count(??) as "count"', ['forum']))
        .from(THREAD)
        .groupBy("forum")
}

async function lastUpdated() {
    return knex(THREAD_DETAIL).max({updated:"updated"}).then(result=>result[0].updated)
}

async function postCount() {
    return knex(THREAD).count("*", {as: 'a'}).then(result=>result[0].a)
}

async function postTrendCount() {
    return knex(THREAD_DETAIL).count("*", {as: 'a'}).then(result=>result[0].a)
}

module.exports = countController