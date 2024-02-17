const express = require('express');
const {isAuthenticated, isAdmin} = require('../middlewares');
const {getAllUsers, getUserByID, updateUserByID} = require("../controllers");


const router = express.Router();

// Get All Users (GET /users)
router.get('/users', isAuthenticated, isAdmin, getAllUsers);

// Get User by ID (GET /users/{userId})
router.get('/users/:userId', isAuthenticated, getUserByID);

// Update User by ID (PUT /users/{userId})
router.put('/users/:userId', isAuthenticated, updateUserByID);


module.exports = router;