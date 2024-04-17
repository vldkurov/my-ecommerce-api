const express = require('express');
const {registerUser, loginUser, logoutUser, checkUser} = require('../controllers');
const {isAuthenticated} = require("../middlewares");
const passport = require('passport');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
// Route to check user authentication status
router.get('/check', isAuthenticated, checkUser);

module.exports = router;



