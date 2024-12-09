const express = require('express');
const router = express.Router();
const userController = require('./controller');

// Define routes for User CRUD operations
router.post('/users', userController.createUser);
router.post('/authen', userController.loginUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
