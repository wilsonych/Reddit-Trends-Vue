require("dotenv").config();

const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const LOG = require("lib/log");
const User = require("model/user");

const LocalStrategy = require("passport-local").Strategy;
const extractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;

const redisCache = require("lib/cache");

const signinStrategy = new LocalStrategy(function (username, password, callback) {
	LOG(username, password);
	User.get(username)
		.then((user) => {
			if (!user) throw new Error("no user match");
			if (!bcrypt.compareSync(password, user.PASSWORD)) throw new Error("Password not match");

			const token = jwt.sign({ username: username, role: user.role }, process.env.SECRET_KEY);
			redisCache.set(username, true,{ttl:3600*24*7});
			return callback(null, { user: username, token: token });
		})
		.catch((err) => {
			console.log(err);
			LOG("Sign in fail");
			return callback(null, false);
		});
});

const requireTokenStrategy = new JWTStrategy(
	{
		secretOrKey: process.env.SECRET_KEY,
		jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
	},
	async function (jwt_payload, callback) {
		//if (authTokens[jwt_payload.username]) {
		if (await redisCache.get(jwt_payload.username)) {
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
//exports.authTokens = authTokens;
exports.passport = passport;
