const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {createCart, addProductToCart, getCartContentByID, cartCheckout} = require("../controllers");

// POST /cart - Create a New Cart
router.post('/', isAuthenticated, createCart);

// POST /cart/{cartId} - Add Products to a Cart
router.post('/:cartId', isAuthenticated, addProductToCart);

// GET /cart/{cartId} - Retrieve a Cart's Contents
router.get('/:cartId', isAuthenticated, getCartContentByID);

// POST /cart/{cartId}/checkout
router.post('/:cartId/checkout', isAuthenticated, cartCheckout);


module.exports = router;
