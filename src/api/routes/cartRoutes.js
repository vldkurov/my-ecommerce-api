const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {
    createCart,
    addProductToCart,
    getCartContentByID,
    cartCheckout,
    deleteProductFromCart
} = require("../controllers");

// POST /carts - Create a New Cart
router.post('/', isAuthenticated, createCart);

// POST /carts/{cartId} - Add Products to a Cart
router.post('/:cartId', isAuthenticated, addProductToCart);

// GET /carts/{cartId} - Retrieve a Cart's Contents
router.get('/:cartId', isAuthenticated, getCartContentByID);

// POST /carts/{cartId}/checkout
router.post('/:cartId/checkout', isAuthenticated, cartCheckout);

// DELETE /carts/{cartId}/items/{cartItemId} - Delete a Product from a Cart
router.delete('/:cartId/items/:cartItemId', isAuthenticated, deleteProductFromCart);


module.exports = router;
