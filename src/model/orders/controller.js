const OrderTable = require('..').orders; // Adjust the path to your models
const OrderPrice = require('..').orderPrice; // Adjust the path to your models
const Rider = require('..').rider; // Adjust the path to your models
const Merchant = require('..').merchant; // Adjust the path to your models
const Image = require('..').image; // Adjust the path to your models
const { Op } = require('sequelize');
const logger = require('../../api/logger');

// Create a new order
// const createOrder = async (req, res) => {
//   try {
//     const order = await OrderTable.create(req.body);
//     res.status(201).json({ message: 'Order created successfully', data: order });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(400).json({ error: error.message });
//   }
// };



const createOrder = async (req, res) => {
  // Log the received order details and images
  console.log('Received Order Details:', req.body.orderDetails);
  console.log('Received Files:', req.files);
  try {
    // Parse the uploaded files and create the order
    const { body, files } = req;
    logger.info(`JSON DATA ${body.orderDetails}`)
    logger.info(`FILE DATA ${req.files}`)


    const orderDetails = JSON.parse(req.body.orderDetails);
    // Create the order
    const order = await OrderTable.create(orderDetails);

    // Store associated images
    if (files && files.length > 0) {
      const imageRecords = files.map((file) => ({
        name: file.originalname,
        path: file.path,
        orderId: order.id,
      }));

      await Image.bulkCreate(imageRecords); // Save all images
    }

    res.status(201).json({
      message: 'Order created successfully',
      data: order,
      images: files ? files.map((file) => file.path) : [],
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderTable.findAll({
      include: [{
        model: OrderPrice,
        as: 'orderPrices', // Specify the alias used in the association
        include: [
          { model: Rider, as: 'rider' },
          { model: Merchant, as: 'merchant' },
        ]
      }, {
        model: Merchant,
        as: 'merchant'
      }
      ]
    });
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
    const order = await OrderTable.findByPk(
      id, {
        include: [{
          model: OrderPrice,
          as: 'orderPrices', // Specify the alias used in the association
          include: [
            { model: Rider, as: 'rider' },
            { model: Merchant, as: 'merchant' },
          ]
        }, {
          model: Merchant,
          as: 'merchant'
        }
        ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get orders by Rider ID or Merchant ID
const getOrdersByRiderOrMechant = async (req, res) => {


  try {
    const { id } = req.params;
    const { type, startDate, endDate } = req.query; // type: 'rider' or 'merchant'

    if (!id || !type) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Base where clause depending on type
    const whereClause = type === 'rider' ? { riderId: id } : { merchantId: id };

    // Add createdAt condition if date filters are provided
    if (startDate && endDate) {
      whereClause.createdAt = {
        // [Op.between]: [new Date(startDate), new Date(endDate)]
        [Op.between]: [
          new Date(`${startDate} 00:00:00`), // Start of the selected date
          new Date(`${endDate} 23:59:59`)    // End of the selected date
        ]
      };
    } else if (startDate) {
      whereClause.createdAt = {
        [Op.gte]: new Date(`${startDate} 00:00:00`)
      };
    } else if (endDate) {
      whereClause.createdAt = {
        [Op.lte]: new Date(`${endDate} 23:59:59`) 
      };
    }

    const orders = await OrderTable.findAll({
      where: whereClause,
      include: [
        {
          model: OrderPrice,
          as: 'orderPrices',
          include: [
            { model: Rider, as: 'rider' },
            { model: Merchant, as: 'merchant' },
          ],
        },
        { model: Merchant, as: 'merchant' },
      ],
    });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
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
// Update an order
const updateOrderStatus = async (req, res) => {
  const { status } = req.body
  logger.warn(`OBJECT ${JSON.stringify(req.body)}}`)
  try {
    const { id } = req.params;
    const [updated] = await OrderTable.update({ status }, { where: { id } });

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
  updateOrderStatus,
  getOrdersByRiderOrMechant
};
