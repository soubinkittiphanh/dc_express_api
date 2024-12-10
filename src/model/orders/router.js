const express = require('express');
const router = express.Router();
const orderController = require('./controller');
const {validateToken} = require('../../api').jwtApi
router.use(validateToken);
// Define routes for Order CRUD operations
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrder);
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
