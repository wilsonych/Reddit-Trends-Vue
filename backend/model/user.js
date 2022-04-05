const knex = require("knexFile");

const {USERS} = require("model/constant");

function uuid() {
	const s4 = () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	return s4() + s4();
}

const Users = {
	update: updateUser,
	get: getUser,
	create: createUser,
};

async function getUser(username) {
	return knex.select("*").from(USERS).where("USERNAME", username).first();
}

async function createUser(username, password) {	
    return knex(USERS).insert({ ID: uuid(), USERNAME: username, PASSWORD: hash, ROLE: "user" });
}

async function updateUser(username , password){
    return knex(USERS).update({PASSWORD:password}).where({USERNAME:username})
}

module.exports = Users;
