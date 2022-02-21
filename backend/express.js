const express = require("express");
const route = require("route");
const cors = require("cors");
const { passport} = require("controller/security");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //{ extended: true }

app.use(cors({ origin: "*" }));

app.use((req, res, next) => {
    console.log(req.originalUrl);
    if (req.headers.timeusage) {
        const timeusage = { start: Number(req.headers.timeusage), transport: Date.now() };
        req.headers.timeusage = timeusage;
    }
    next();
});

app.use(passport.initialize());

app.use("/api", route);

module.exports = app;
