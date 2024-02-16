const express = require('express');
const passport = require('passport');
const {registerUser} = require('../controllers/userController'); // Adjust the path as necessary
const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
}));

module.exports = router;
