const {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    jwtSecret,
    refreshSecret
} = require('./tokenUtils')
const {handleServerError, handleAuthenticationError} = require('./errorHandlers')
const formatPrice = require('./formatPrice')
const calculateTotalPrice = require('./calculateTotalPrice')

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    jwtSecret,
    refreshSecret, handleServerError, handleAuthenticationError, formatPrice, calculateTotalPrice
}
