const express = require('express');
const router = express.Router();
const {
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID, getAllCategory
} = require("../controllers");
const {isAuthenticated, isAdmin} = require("../middlewares");

// GET /products/categories
router.get('/categories', getAllCategory);

// GET /products/all?category={categoryId}
router.get('/all', getProductByCategory);

// GET /products/{productId}
router.get('/:productId', getProductByID);

// POST /products
router.post('/', isAuthenticated, isAdmin, createProduct);

// PUT /products/{productId}
router.put('/:productId', isAuthenticated, isAdmin, updateProductByID);

// DELETE /products/{productId}
router.delete('/:productId', isAuthenticated, isAdmin, deleteProductByID);


module.exports = router;
