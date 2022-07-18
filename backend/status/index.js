const { containerStatus, containerInfo } = require("./docker");
const { ram } = require("./system");

const status = {
    get: {
        containerStatus: containerStatus,
        containerInfo: containerInfo,
        ram: ram,
    },
};

module.exports = status;
