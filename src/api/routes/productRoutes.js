const express = require('express');
const router = express.Router();
const {
    getProductByCategory,
    getProductByID,
    createProduct,
    updateProductByID,
    deleteProductByID
} = require("../controllers");
const {isAuthenticated, isAdmin} = require("../middlewares");

// GET /products?category={categoryId}
router.get('/', getProductByCategory);

// GET /products/{productId}
router.get('/:productId', getProductByID);

// POST /products
router.post('/', isAuthenticated, isAdmin, createProduct);

// PUT /products/{productId}
router.put('/:productId', isAuthenticated, isAdmin, updateProductByID);

// DELETE /products/{productId}
router.delete('/:productId', isAuthenticated, isAdmin, deleteProductByID);


module.exports = router;
