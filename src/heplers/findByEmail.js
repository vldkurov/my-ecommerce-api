const {UserModel} = require("../models");


// Finds a user by their email.

function findByEmail(email) {
    return UserModel.findOne({
        where: {
            email: email
        }
    });
}

module.exports = findByEmail
