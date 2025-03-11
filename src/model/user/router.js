const express = require('express');
const router = express.Router();
const userController = require('./controller');
const userService = require('./service');
const { validateToken } = require('../../api').jwtApi;

// Public route (no token required)
router.post('/registration', userService.registration);

// Protected routes (require token)
router.get('/', validateToken, userController.getAllUsers);
router.get('/:id', validateToken, userController.getUserById);
router.put('/:id', validateToken, userController.updateUser);
router.delete('/:id', validateToken, userController.deleteUser);

module.exports = router;
