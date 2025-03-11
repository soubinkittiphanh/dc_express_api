const logger = require('../../api/logger');
const { sequelizeDCExpress } = require('../../model')
const OrderPrice = require('..').orderPrice; // Adjust the path to your models
const orderService = require('../orders/service')
// Create a new order price
const createOrderPrice = async (req, res) => {
  try {
    const { price, priceStatus, isActive, riderId, merchantId, orderId } = req.body;
    const orderPrice = await OrderPrice.create({ price, priceStatus, isActive, riderId, merchantId, orderId });
    res.status(201).json({ message: 'Order price created successfully', data: orderPrice });
  } catch (error) {
    console.error('Error creating order price:', error);
    res.status(400).json({ error: error.message });
  }
};

const acceptOrderPrice = async (req, res) => {
  const { id } = req.params;
  const { price, priceStatus, isActive, orderId } = req.body;
  logger.warn(`ORDER PRICE DET ${id} orderId ${orderId}`)
  try {
    const orderPriceList = await OrderPrice.findAll({ where: { orderId, priceStatus: 'ACCEPT' } });
    logger.warn(`RESPONSE ${JSON.stringify(orderPriceList)}`)
    if (orderPriceList.length > 0) {
      // Someone already took the order / Merchant already accepted an offer
      return res.status(400).json({ error: 'Order already taken' }); // Use res.status, not req.status
    } else {
      // No one has taken this order yet
      const result = await sequelizeDCExpress.transaction(async (t) => {
        const [updatedCount, updatedOrderPrices] = await OrderPrice.update(
          { priceStatus: 'ACCEPT' },
          { where: { id }, returning: true, },
          { transaction: t }  // Add returning: true to get updated records
        );
        const responseCode = await orderService.changeOrderStatus(orderId, 'ACCEPT', t);
        logger.info(`Order service response code ${responseCode} update count ${updatedCount} update ${updatedOrderPrices}`)
        if (responseCode == 200 && updatedOrderPrices > 0) {
          return 200
        } else {
          return 503
        }
      })
      logger.warn(`Transaction response ${result}`)

      if (result != 200) {
        return res.status(404).json({ error: 'Order price not found' }); // Handle case where no record was updated
      }

      return res.status(200).json({
        message: 'Order price updated successfully',
        data: 'updateResponseRecord', // Access the first element of the updatedOrderPrices array
      });
    }
  } catch (error) {
    logger.error('Error updating order price:', error); // Log the error
    return res.status(500).json({ error: 'Internal server error' }); // Return a 500 error
  }
};

// Get all order prices
const getAllOrderPrices = async (req, res) => {
  try {
    const orderPrices = await OrderPrice.findAll({ include: ['rider', 'merchant'] });
    res.status(200).json({ data: orderPrices });
  } catch (error) {
    console.error('Error fetching order prices:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get an order price by ID
const getOrderPriceById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderPrice = await OrderPrice.findByPk(id);

    if (!orderPrice) {
      return res.status(404).json({ message: 'Order price not found' });
    }

    res.status(200).json({ data: orderPrice });
  } catch (error) {
    console.error('Error fetching order price:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an order price
const updateOrderPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { price, priceStatus, isActive } = req.body;

    const [updated] = await OrderPrice.update({ price, priceStatus, isActive }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Order price not found or no changes made' });
    }

    const updatedOrderPrice = await OrderPrice.findByPk(id);
    res.status(200).json({ message: 'Order price updated successfully', data: updatedOrderPrice });
  } catch (error) {
    console.error('Error updating order price:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete an order price
const deleteOrderPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrderPrice.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Order price not found' });
    }

    res.status(200).json({ message: 'Order price deleted successfully' });
  } catch (error) {
    console.error('Error deleting order price:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrderPrice,
  getAllOrderPrices,
  getOrderPriceById,
  updateOrderPrice,
  deleteOrderPrice,
  acceptOrderPrice
};
