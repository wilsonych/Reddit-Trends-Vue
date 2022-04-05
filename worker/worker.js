const axios = require("axios");
const fs = require("fs");
const LOG = require("./log");

const THREADS = "threads"
const THREADSTAT = "threadsStat"

class Worker {
    constructor(forums, insertDBInterval = 1800, scrapeInterval = 300) {
        this.token = "";
        this.forums = forums || [];
        this.insertDBInterval = insertDBInterval; // insertDBInterval in second
        this.scrapeInterval = scrapeInterval;
        this.insertTimeStamp = 0;
        this.last = {
            scrape: 0,
            insertDB: 0,
        };
        this.counter = {
            success: 0,
            fail: 0,
        };
        this.data={
            threads:{},
            threadsStat:{}
        }
    }

    start() {
        this.data.threadsStat=require(`./store/cache/${THREADSTAT}.json`)
        this.data.threads=require(`./store/cache/${THREADS}.json`)
        
        this.getLatest();   
        this.updateTimeStamp();     
        this.handleInsertDB();
        this.handleScrape();
    }

    async handleInsertDB() {
        const timeOffset = this.insertDBInterval * 1000 - (Date.now() - this.last.insertDB);
        if (timeOffset <= 0) {
            LOG("start insert into DB");   
            this.insertDB(THREADSTAT)         
            this.insertDB(THREADS)
            this.last.insertDB = Date.now(); 
            this.updateLatest();
            this.updateTimeStamp();   
            setTimeout(() => this.handleInsertDB(), this.insertDBInterval * 1000);
            LOG("Start insert DB after ", new Date (Date.now()+this.insertDBInterval * 1000).toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}));
        } else {
            LOG("Start insert DB after ", timeOffset / 1000, "s");
            setTimeout(() => this.handleInsertDB(), timeOffset);
        }
    }

    updateTimeStamp() {
        this.insertTimeStamp = new Date((this.last.insertDB || new Date()) + this.insertDBInterval * 1000);
        LOG("insertTimeStamp", this.insertTimeStamp.toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}));
    }

    handleScrape() {
        const timeOffset = this.scrapeInterval * 1000 - (Date.now() - this.last.scrape);
        if (timeOffset <= 0) {
            this.forums.forEach((forum) => this.getByForum(forum));
            this.last.scrape = Date.now();
            this.updateLatest();
            setTimeout(() => this.handleScrape(), this.scrapeInterval * 1000);
            LOG("Start scraping after ",new Date (Date.now()+this.scrapeInterval * 1000).toLocaleString("en-US", {timeZone: "Asia/Hong_Kong"}));
        } else {
            setTimeout(() => this.handleScrape(), timeOffset);
            LOG("Start scraping after ", timeOffset / 1000, "s");
        }
    }

    async retrieveToken() {
        LOG("Retrieving token from server");
        const option = {
            method: "post",
            url: "http://qstore.info/api/user/signin",
            data: {
                username: "admin",
                password: "wewe200",
            },
        };
        await axios(option)
            .then((res) => {
                this.token = res.data.token;
                LOG("Retrieve token success");
            })
            .catch((err) => {
                LOG("Retrieve token fail");
                LOG(err);
            });
    }


    getLatest() {
        const last = require("./last.json");
        if (!"scrape" in last) last.scrape = Date.now();
        if (!"insertDB" in last) last.insertDB = Date.now();
        LOG(last);
        this.last = last;
    }

    updateLatest() {
        fs.writeFileSync("last.json", JSON.stringify(this.last));
    }

    cache(){
        fs.writeFileSync(`./store/cache/${THREADSTAT}.json`, JSON.stringify(this.data.threadsStat));
        fs.writeFileSync(`./store/cache/${THREADS}.json`, JSON.stringify(this.data.threads));
    }

    clearCache(target){
        fs.writeFileSync(`store/cache/${target}.json`, "{}");
    }

    async getByForum(forum) {
        LOG("Getting ", forum);
        const url = `https://reddit.com/r/${forum}.json`;
        await axios(url)
            .then((res) => {
                const threads = res.data.data.children;
                threads.forEach((thread) => {
                    const id = thread.data.id;
                    if (!this.data.threadsStat[id]) this.data.threadsStat[id] = {};
                    this.data.threadsStat[id] = {
                        id: thread.data.id,
                        vote: thread.data.score,
                        comment: thread.data.num_comments,
                        forum: thread.data.subreddit,
                        updated: this.insertTimeStamp ,
                    };

                    if (!this.data.threads[id]) this.data.threads[id] = {};
                    this.data.threads[id] = {
                        id: thread.data.id,
                        title: thread.data.title,
                        created: this.insertTimeStamp ,
                        forum: thread.data.subreddit,
                    };
                });
                this.cache()
            })
            .catch((err) => {
                LOG(err);
            });
    }

    saveFail(target,data){
        fs.appendFileSync(`./store/fail/${target}.json`, JSON.stringify(data)+",\n");
    }

    async insertDB(target){
        if (Object.keys(this.data[target]).length == 0) return LOG(`Empty target ${target}`)
        if (!this.token) await this.retrieveToken();
        const data = Object.keys(this.data[target]).map(key=>({...this.data[target][key],id:key}))
        const url = `http://qstore.info/api/post/${target}`
        const option = {
            method: "POST",
            url: url,
            headers: { Authorization: `Bearer ${this.token}` },
            data: {
                thread: data,
            },
        };
        axios(option)
            .then((res) => {
                LOG(`Save ${target}: ${res.data.slice(0,4)}... success`);
            })
            .catch(async (err) => {
                if (err.response) {
                    if (err.response.status === 401) {
                        await this.retrieveToken();
                        await this.insertDB(target);
                    }
                }
                LOG(`Save ${target} fail`);
                LOG.save(err);
                this.saveFail(target,data)
            })
            .finally(()=>{
                this.clearCache(target)
                this.data[target] = {};
            })
    }

  
}

module.exports = Worker;
