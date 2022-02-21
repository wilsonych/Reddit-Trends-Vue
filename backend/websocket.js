const LOG = require("lib/log");
const SocketServer = require("ws").Server;
const { containerStatus } = require("status/docker");

function sendData(ws) {
    return setInterval(() => {
        containerStatus()
            .then((data) => ws.send(JSON.stringify(data)))
            .catch((error) => console.error(error));
    }, 1500);
}

function initWebsocket(server, path) {
    const wss = new SocketServer({ server, path: path });
    wss.on("connection", (ws) => {
        LOG("Client connected");

        const monotor = sendData(ws);

        ws.on("close", () => {
            LOG("Close connected");
            clearInterval(monotor);
        });
    });
}

module.exports = initWebsocket;
