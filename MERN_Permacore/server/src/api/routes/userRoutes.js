const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { authenticate, isSupplierQuality } = require('../../middleware/authMiddleware');

router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/', authenticate, UserController.getAllUsers);
router.put('/:id', authenticate, UserController.updateUser);
router.put('/reassignRole', authenticate, isSupplierQuality, UserController.reassignRole);

module.exports = router;
