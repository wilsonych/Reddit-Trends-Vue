const { passport } = require("controller/security");
const verify = require("lib/verifier");
const Users = require("model/user");
const LOG = require("lib/log");
const bcrypt = require("bcrypt");


const userController = {
    post: {
        signin: signin,
        signup: signup,
    },
    put: changePassowrd,
};

async function signin(req) {
    verify.exact(["username", "password"], req.body);

    return new Promise((resolve, reject) => {
        passport.authenticate("signin", (err, user, info) => {
            if (err) reject(err);
            if (!user) reject("Incorrect user name or password");
            LOG(JSON.stringify(user));
            resolve(user);
        })(req);
    });
} 

async function signup(req) {
    const { username, password } = verify.exact(["username", "password"], req.body)

    if (Users.all[username]) throw new Error("User exsit");
    const hash = bcrypt.hashSync(password, 10);
    Users.all[username] = { username: username, password: hash };
    Users.update();
    
    return await signin(req)
}

async function changePassowrd(req) {    
    const { username, newPassword, oldPassword } = verify.exact(["username", "newPassword", "oldPassword"], req.body);

    if (!Users.all[username]) throw new Error("User not exsit");
    if (bcrypt.compareSync(oldPassword, Users.all[username].password)) {
        const hash = bcrypt.hashSync(newPassword, 10);
        Users.all[username].password = hash;
        Users.update();
    } else {
        throw new Error("Password not match");
    }
    return "Password change success";
}

module.exports = userController;