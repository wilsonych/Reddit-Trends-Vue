const os = require("os")

function toMB(byte){
    return parseInt(byte/1000/1000)
}


async function ram(){
    return {total:toMB(os.totalmem()),free:toMB(os.freemem())}
}

module.exports.ram=ram