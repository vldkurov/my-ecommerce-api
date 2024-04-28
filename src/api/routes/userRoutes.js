const express = require('express');
const {registerUser, loginUser, checkUser, refreshToken, logoutUser, googleOAuth} = require('../controllers');
const {isAuthenticated, authenticateLocal, authenticateGoogle, authenticateGoogleCallback} = require("../middlewares");

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', authenticateLocal, loginUser);
router.post('/refresh', refreshToken);
router.post('/logout', isAuthenticated, logoutUser);
// Route to check user authentication status
router.get('/check', isAuthenticated, checkUser);
// Google OAuth
router.get('/auth/google', authenticateGoogle);
router.get('/auth/google/callback', authenticateGoogleCallback, googleOAuth);


module.exports = router;
