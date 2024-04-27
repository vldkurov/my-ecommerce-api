const jwt = require('jsonwebtoken');
const config = require("../config/config");

const jwtSecret = config.jwt_secret;
const refreshSecret = config.refresh_secret;

const generateAccessToken = (user) => {
    const payload = {
        sub: user.userId,
        email: user.email
    };
    return jwt.sign(payload, jwtSecret, {expiresIn: '15m'});
};

const generateRefreshToken = (user) => {
    const payload = {
        sub: user.userId,
        email: user.email
    };
    return jwt.sign(payload, refreshSecret, {expiresIn: '7d'});
};

const verifyRefreshToken = (token) => {
    return jwt.verify(token, refreshSecret);
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    jwtSecret,
    refreshSecret
};
