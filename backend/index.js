require("dotenv").config();
const LOG = require("lib/log");
//const Worker = require("./worker")
const initWebsocket = require("./websocket")

const PORT = process.env.BACKEND_PORT;
const app = require("./express");
const server = app.listen(PORT, () => {
    LOG(`app listen on port ${PORT}`);
});

initWebsocket(server,"/api/ws")

//const worker = new Worker(["SPACs","stocks","wallstreetbets","CryptoCurrency","SatoshiStreetBets"],1800)

//worker.start()

