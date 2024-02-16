const {registerUser, loginUser, logoutUser} = require('./userController');
const {getProductByCategory, getProductByID} = require('./productController')

module.exports = {
    // User
    registerUser,
    loginUser,
    logoutUser,
    // Product
    getProductByCategory,
    getProductByID
};