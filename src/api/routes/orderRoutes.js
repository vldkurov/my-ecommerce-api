const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {getAllOrders, getOrderByID} = require("../controllers");

// GET /orders - List All Orders for a User
router.get('/', isAuthenticated, getAllOrders);

// GET /orders/{orderId} - Get Details of a Specific Order
router.get('/:orderId', isAuthenticated, getOrderByID);


module.exports = router;