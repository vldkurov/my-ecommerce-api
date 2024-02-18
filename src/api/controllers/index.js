const {registerUser, loginUser, logoutUser} = require('./userController');
const {
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID
} = require('./productController')
const {getAllUsers, getUserByID, updateUserByID} = require('./accountController')
const {createCart, addProductToCart, getCartContentByID, cartCheckout} = require('./cartController')


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
    deleteProductByID,
    // Accounts
    getAllUsers,
    getUserByID,
    updateUserByID,
    // Carts
    createCart,
    addProductToCart,
    getCartContentByID,
    // Order
    cartCheckout,
};