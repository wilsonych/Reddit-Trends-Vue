const LOG = require("./log");
const Worker = require("./worker")

const worker = new Worker(["SPACs","stocks","wallstreetbets","CryptoCurrency","investing","robinhood","SatoshiStreetBets"])  
    
worker.start()