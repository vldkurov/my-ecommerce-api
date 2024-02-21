const express = require('express');
const {isAuthenticated, isAdmin, findByPkUser} = require('../middlewares');
const {getAllUsers, getUserByID, updateUserByID} = require("../controllers");


const router = express.Router();

// Param middleware that will run before any route with userId parameter
router.param('userId', findByPkUser);

// Get All Users (GET /users)
router.get('/users', isAuthenticated, isAdmin, getAllUsers);

// Get User by ID (GET /users/{userId})
router.get('/users/:userId', isAuthenticated, getUserByID);

// Update User by ID (PUT /users/{userId})
router.put('/users/:userId', isAuthenticated, updateUserByID);


module.exports = router;