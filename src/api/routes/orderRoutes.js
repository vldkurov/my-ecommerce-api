const express = require('express');
const router = express.Router();
const {isAuthenticated} = require("../middlewares");
const {getAllOrders, getOrderByID} = require("../controllers");


router.get('/', isAuthenticated, getAllOrders);

router.get('/:orderId', isAuthenticated, getOrderByID);


module.exports = router;