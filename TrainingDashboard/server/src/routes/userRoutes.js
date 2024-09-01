const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.authenticateUser);
router.get('/find', userController.findUser);
router.delete('/:id', userController.deleteUser);
router.put('/users/:userId', userController.updateUser);
router.get('/divisions', userController.fetchAllDivisions);
router.get('/users', userController.getAllUsers);


module.exports = router;
