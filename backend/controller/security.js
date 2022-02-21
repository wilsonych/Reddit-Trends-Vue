require("dotenv").config();

const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const LOG = require("lib/log");
const users = require("model/user");

const LocalStrategy = require("passport-local").Strategy;
const extractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const authTokens = {};

const signinStrategy = new LocalStrategy(function (username, password, callback) {
    LOG(username, password);
    if (users.all[username] && bcrypt.compareSync(password, users.all[username].password)) {
        LOG("Sign in success");
        const user = { username: username, password: users.all[username].password };
        const token = jwt.sign(user, process.env.SECRET_KEY);
        authTokens[username] = true;
        return callback(null, { user: username, token: token });
    } else {
        LOG("Sign in fail");
        return callback(null, false);
    }
});

const requireTokenStrategy = new JWTStrategy(
    {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    },
    async function (jwt_payload, callback) {
        //LOG(jwt_payload);
        //LOG(authTokens);
        if (authTokens[jwt_payload.username]) {
            // Pass the user information to next step
            return callback(null, jwt_payload);
        } else {
            return callback(null, false, "no token present");
        }
    }
);

passport.use("signin", signinStrategy);
passport.use("requireToken", requireTokenStrategy);

const requireToken = (req, res, next) => {
    passport.authenticate("requireToken", (err, user, info) => {
        if (err) return res.status(400).json(err);
        if (!user) return res.status(401).json("Unauthorized access");
        next();
    })(req, res, next);
};

exports.requireToken = requireToken;
exports.authTokens = authTokens;
exports.passport = passport;
