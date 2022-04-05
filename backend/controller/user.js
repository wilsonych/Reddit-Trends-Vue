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
	const { username, password } = verify.exact(["username", "password"], req.body);
    const hash = bcrypt.hashSync(password, 10);	

	return Users.create(username, hash)
		.then(async () => signin(req))
		.catch((err) => {
			console.log(err);
			throw new Error("User exsit");
		});
}

async function changePassowrd(req) {
	const { username, newPassword, oldPassword } = verify.exact(["username", "newPassword", "oldPassword"], req.body);

	return Users.get(username)
		.then(async (user) => {
			if (!user) throw new Error("User not exsit");
			if (bcrypt.compareSync(oldPassword, user.PASSWORD)) {
				const hash = bcrypt.hashSync(newPassword, 10);
				await Users.update(username, hash);
				return "Password change success";
			} else {
				throw new Error("Password not match");
			}
		})
		.catch((err) => {
			console.log(err);
			throw err;
		});
}

module.exports = userController;
