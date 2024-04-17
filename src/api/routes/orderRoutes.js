const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {getAllOrders, getOrderByID, createOrder, cancelOrder} = require("../controllers");


router.get('/', isAuthenticated, getAllOrders);

router.get('/:orderId', isAuthenticated, getOrderByID);

router.post('/', isAuthenticated, createOrder);

router.patch('/:orderId/cancel', isAuthenticated, cancelOrder);


module.exports = router;
