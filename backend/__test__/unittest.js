const Worker = require("./worker");
const worker = new Worker(["SPACs"], 1000);
const assert = require("assert");
const expect = require("expect");
const axios = require("axios");
const postController = require("controller/post");
const { execPath } = require("process");
const LOG = require("lib/log");


describe("Worker", () => {
    

    it('Should update the latest time', done => {
        worker.updateLatest()
        assert.equal(worker.latestScrape, worker.getLatest());
        done()
    });

    it('getByForum should return array', async () => {
        const result = await worker.getByForum("SPACs")
        expect(result).toBeInstanceOf(Array)
        expect(result[0]).toHaveProperty("id")
    });
   
});

describe('Public API', () => {

    it('GET /count/post should show post quantity', async () => {
        const res = await requestWithSupertest.get('/api_public/count/post');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining("text/html"));
    });

    it('GET /count/post should show post trend quantity', async () => {
        const res = await requestWithSupertest.get('/api_public/count/post_trend');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining("text/html"));
    });

    it('GET /count/last should show the lastest update', async () => {
        const res = await requestWithSupertest.get('/api_public/count/last');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining("json"));
        expect(res.body[0]).toHaveProperty('updated')
    });

    it('GET /count/forum should show the lastest record of each forum', async () => {
        const res = await requestWithSupertest.get('/api_public/count/forum');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining("json"));
        expect(res.body).toHaveLength(5)
    });
});
/**
describe("Post controller", () => {
    it("Should return ids after insert", async (done) => {
        const ids = testData.map((x) => x.id);
        const req = { body: { thread:testData}};
        const result = await postController.post.threads(req);
        console.log(result);
        expect(result).toBeInstanceOf(Array);
        expect(result).toEqual(expect.arrayContaining(ids));
        done()
    });
});
 */
