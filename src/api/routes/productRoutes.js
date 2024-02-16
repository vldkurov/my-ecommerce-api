const express = require('express');
const router = express.Router();
const {getProductByCategory, getProductByID} = require("../controllers");

// GET /products?category={categoryId}
router.get('/', getProductByCategory);

// GET /products/{productId}
router.get('/:productId', getProductByID);

module.exports = router;
