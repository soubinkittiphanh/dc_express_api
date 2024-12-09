const express = require('express');
const router = express.Router();
const orderPriceController = require('./controller');

// Define routes for OrderPrice CRUD operations
router.post('/order-prices', orderPriceController.createOrderPrice);
router.get('/order-prices', orderPriceController.getAllOrderPrices);
router.get('/order-prices/:id', orderPriceController.getOrderPriceById);
router.put('/order-prices/:id', orderPriceController.updateOrderPrice);
router.delete('/order-prices/:id', orderPriceController.deleteOrderPrice);

module.exports = router;
