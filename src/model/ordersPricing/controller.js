const OrderPrice = require('..').orderPrice; // Adjust the path to your models

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
};
