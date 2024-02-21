const jwt = require('jsonwebtoken');
const config = require('../config/config');

const tokenExpiration = '1d'

const generateToken = (userId) => {
    return jwt.sign({userId}, config.jwt_secret, {expiresIn: tokenExpiration});
};

module.exports = {generateToken};
