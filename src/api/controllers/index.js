const {registerUser, loginUser, logoutUser} = require('./userController');
const {
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID
} = require('./productController')

module.exports = {
    // User
    registerUser,
    loginUser,
    logoutUser,
    // Product
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID
};