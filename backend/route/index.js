const express = require("express");
const router = express.Router();
const { requireToken } = require("controller/security");

const wrapper = require("lib/wrapper");

const countController = require("controller/count");
const postController = require("controller/post");
const userController = require("controller/user");

const status = require("status");

router.all("/post/:endpoint", requireToken, wrapper(postController));//

router.all("/count/:endpoint", wrapper(countController));
router.all("/status/:endpoint", wrapper(status));

router.post("/user/:endpoint", wrapper(userController));
router.put("/user", wrapper(userController));

router.get("/public", postController.public)

router.get("/verify", requireToken, (req, res) => {
    console.log(res);
    res.send("Success");
});

module.exports = router;
