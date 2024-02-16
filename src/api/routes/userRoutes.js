const express = require('express');
const {registerUser, loginUser, logoutUser} = require('../controllers');
const {requireAuth} = require("../middlewares");

const router = express.Router();


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/logout', requireAuth, logoutUser);

module.exports = router;



