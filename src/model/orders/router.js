const express = require('express');
const router = express.Router();
const orderController = require('./controller');
const {validateToken} = require('../../api').jwtApi
router.use(validateToken);
// Define routes for Order CRUD operations
router.post('/create', orderController.createOrder);
router.get('/find', orderController.getAllOrders);
router.get('/find/:id', orderController.getOrderById);
router.put('/update/:id', orderController.updateOrder);
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;
