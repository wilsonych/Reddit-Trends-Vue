require("dotenv").config();
const oracledb = require("oracledb");
const LOG = require("lib/log");
const path = require("path");
const fs = require("fs");

const wallet = process.env.WALLET;
const instantclient = process.env.LD_LIBRARY_PATH;
const sqlnet = path.join(wallet, "sqlnet.ora");
const data = `WALLET_LOCATION = (SOURCE = (METHOD = file) (METHOD_DATA = (DIRECTORY="${wallet}")))
SSL_SERVER_DN_MATCH=yes`;

const knex = require("knex")({
    client: "oracledb",
    connection: {
        user: process.env.DATABASEUSER,
        password: process.env.DATABASEPASS,
        requestTimeout: 100,
        connectString: process.env.CONNNETSTRING,
        database: "ADMIN",
    },
    fetchAsString: ["number", "clob"],
});

async function initOracleDB() {
    try {
        fs.writeFileSync(sqlnet, data);
        LOG("Write sqlnet.ora success");
        //LOG("configDir:wallet ",wallet)
        //LOG("lidDir:instantclient ",instantclient)
        oracledb.initOracleClient({
            configDir: wallet,
            libDir: instantclient,
        });
        LOG("Database connect success");
    } catch (err) {
        LOG("Database connect fail");
        LOG("Try to execute below command");
        LOG(`export LD_LIBRARY_PATH=${instantclient}`);
        LOG(err);
        process.exit(1);
    }
}

//initOracleDB();

module.exports = knex;
