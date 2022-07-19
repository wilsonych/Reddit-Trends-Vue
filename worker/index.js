const LOG = require("./log");
const Worker = require("./worker")
const dotenv = require("dotenv")
dotenv.config()

const worker = new Worker(["SPACs","stocks","wallstreetbets","CryptoCurrency","investing","robinhood","SatoshiStreetBets"])  

worker.start()