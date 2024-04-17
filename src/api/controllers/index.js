const {registerUser, loginUser, logoutUser, checkUser} = require('./userController');
const {
    getAllCategory,
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID
} = require('./productController')
const {getAllUsers, getUserByID, updateUserByID} = require('./accountController')
const {
    createCart,
    addProductToCart,
    getCartContentByID,
    cartCheckout,
    deleteProductFromCart
} = require('./cartController')
const {getAllOrders, getOrderByID, createOrder} = require('./orderController')


module.exports = {
    // User
    registerUser,
    loginUser,
    logoutUser,
    checkUser,
    // Product
    getAllCategory,
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
    cartCheckout,
    deleteProductFromCart,
    // Order
    getAllOrders,
    getOrderByID,
    createOrder
};
