const  OrderTable  = require('..').orders; // Adjust the path to your models

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = await OrderTable.create(req.body);
    res.status(201).json({ message: 'Order created successfully', data: order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderTable.findAll();
    res.status(200).json({ data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get an order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderTable.findByPk(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await OrderTable.update(req.body, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found or no changes made' });
    }

    const updatedOrder = await OrderTable.findByPk(id);
    res.status(200).json({ message: 'Order updated successfully', data: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ error: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrderTable.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
