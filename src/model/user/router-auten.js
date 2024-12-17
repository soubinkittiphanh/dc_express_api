const express = require('express');
const router = express.Router();
const userController = require('./controller');

router.post('/authen', userController.loginUser);
router.post('/register', userController.createUser);
module.exports = router;
