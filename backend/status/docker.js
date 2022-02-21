const si = require("systeminformation");

function toMB(byte){
    return parseInt(byte/1000/1000)
}

async function containerInfo() {
    const details = await si.dockerContainers();
    return details.map((x) => ({ id: x.id, name: x.name, image: x.image, started: x.started * 1000 }));
}

async function containerStatus() {
    const details = await si.dockerContainerStats();
    return details.map((x) => ({ id: x.id, memUsage: toMB(x.memUsage), memLimit: toMB(x.memLimit), cpuPercent: x.cpuPercent.toFixed(2)}));
}

module.exports.containerInfo = containerInfo;
module.exports.containerStatus = containerStatus;