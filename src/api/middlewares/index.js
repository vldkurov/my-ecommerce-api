const {isAuthenticated, authenticateLocal} = require('./authMiddleware')
const {isAdmin} = require('./isAdmin')
const {findByPkUser} = require('./findByPkUser')

module.exports = {isAuthenticated, authenticateLocal, isAdmin, findByPkUser}
