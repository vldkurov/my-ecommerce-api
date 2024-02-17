const express = require('express');
const {registerUser, loginUser, logoutUser} = require('../controllers');
const {isAuthenticated} = require("../middlewares");

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', isAuthenticated, logoutUser);

module.exports = router;



