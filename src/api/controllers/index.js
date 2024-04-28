const {registerUser, loginUser, logoutUser, checkUser, refreshToken, googleOAuth} = require('./userController');
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
const {
    getAllOrders,
    getOrderByID,
    createOrder,
    cancelOrder,
    createCheckoutSession, handlePaymentSuccess, handlePaymentCancellation,
} = require('./orderController')


module.exports = {
    // User
    registerUser,
    loginUser,
    logoutUser,
    checkUser,
    refreshToken,
    googleOAuth,
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
    createOrder,
    cancelOrder,
    createCheckoutSession,
    handlePaymentSuccess,
    handlePaymentCancellation
};
