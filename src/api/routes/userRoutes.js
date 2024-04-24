const express = require('express');
const {registerUser, loginUser, logoutUser, checkUser} = require('../controllers');
const {isAuthenticated} = require("../middlewares");
const passport = require('passport');
const config = require('../../config/config');

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
// Route to check user authentication status
router.get('/check', isAuthenticated, checkUser);

// Google
router.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/login'}),
    function (req, res) {
        // Successful authentication, redirect home or wherever you like.
        // res.redirect('/');
        res.redirect(config.client_url);
    });


module.exports = router;



