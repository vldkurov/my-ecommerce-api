const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {getAllOrders, getOrderByID, createOrder} = require("../controllers");


router.get('/', isAuthenticated, getAllOrders);

router.get('/:orderId', isAuthenticated, getOrderByID);

router.post('/', isAuthenticated, createOrder);


module.exports = router;
