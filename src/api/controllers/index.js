const {registerUser, loginUser, logoutUser} = require('./userController');
const {
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID
} = require('./productController')
const {getAllUsers, getUserByID, updateUserByID} = require('./accountController')

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
    //Accounts
    getAllUsers,
    getUserByID,
    updateUserByID
};