const {isAuthenticated} = require('./isAuthenticated')
const {isAdmin} = require('./isAdmin')
const {findByPkUser} = require('./findByPkUser')

module.exports = {isAuthenticated, isAdmin, findByPkUser}