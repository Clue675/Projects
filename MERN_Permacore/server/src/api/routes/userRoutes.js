const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController'); // Adjust the path to your UserController

// Register a new user
router.post('/register', UserController.registerUser);

// User login
router.post('/login', UserController.loginUser);

// Update a user's profile
router.put('/update/:id', UserController.updateUser);

// Reassign a user's role
router.put('/reassignRole', UserController.reassignRole);

module.exports = router;
