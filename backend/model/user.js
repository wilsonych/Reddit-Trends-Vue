const fs = require("fs");

const Users= {
    all:getAllUser(),
    update:updateUser
}

function getAllUser(){
    return require(__dirname + "/user.json")
}

function updateUser() {
    fs.writeFileSync(__dirname + "/user.json", JSON.stringify(Users.all));
    Users.all = getAllUser()
}

module.exports = Users