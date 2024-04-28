const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {
    getAllOrders,
    getOrderByID,
    createOrder,
    cancelOrder,
    createCheckoutSession,
} = require("../controllers");


router.get('/', isAuthenticated, getAllOrders);

router.get('/:orderId', isAuthenticated, getOrderByID);

router.post('/', isAuthenticated, createOrder);

router.patch('/:orderId/cancel', isAuthenticated, cancelOrder);

router.post('/create-checkout-session', isAuthenticated, createCheckoutSession);

module.exports = router;
