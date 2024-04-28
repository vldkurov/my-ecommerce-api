const {isAuthenticated, authenticateLocal, authenticateGoogle, authenticateGoogleCallback} = require('./authMiddleware')
const {isAdmin} = require('./isAdmin')
const {findByPkUser} = require('./findByPkUser')

module.exports = {
    isAuthenticated,
    authenticateLocal,
    isAdmin,
    findByPkUser,
    authenticateGoogle,
    authenticateGoogleCallback
}
