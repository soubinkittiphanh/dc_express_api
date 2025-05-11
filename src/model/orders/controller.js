const OrderTable = require('..').orders; // Adjust the path to your models
const OrderPrice = require('..').orderPrice; // Adjust the path to your models
const Rider = require('..').rider; // Adjust the path to your models
const Merchant = require('..').merchant; // Adjust the path to your models
const Image = require('..').image; // Adjust the path to your models
const { Op } = require('sequelize');
const logger = require('../../api/logger');
const fs = require('fs');
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



const updateOrder = async (req, res) => {
  try {
    const { body, files } = req;
    const { id } = req.params;

    // Parse JSON fields
    const orderDetails = JSON.parse(body.orderDetails);
    const existingImageIds = JSON.parse(body.existingImageIds || '[]'); // safe default

    logger.info(`Updating order ID: ${id}`);
    logger.info(`Order details: ${JSON.stringify(orderDetails)}`);
    logger.info(`Existing image IDs to keep: ${existingImageIds}`);

    // Update the order
    const [updated] = await OrderTable.update(orderDetails, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Order not found or no changes made' });
    }

    // Delete old images not in kept list
    const imagesToDelete = await Image.findAll({
      where: {
        orderId: id,
        id: { [Op.notIn]: existingImageIds },
      },
    });

    for (const img of imagesToDelete) {
      if (fs.existsSync(img.filePath)) {
        fs.unlinkSync(img.filePath);
      }
      await img.destroy();
    }

    // Save new uploaded images
    if (files && files.length > 0) {
      for (const file of files) {
        await Image.create({
          orderId: id,
          name: file.filename,   // ✅ use 'name' instead of 'fileName'
          path: file.path        // ✅ use 'path' instead of 'filePath'
        });        
      }
    }

    // Fetch updated order with associated images (corrected with alias)
    const updatedOrder = await OrderTable.findByPk(id, {
      include: [{ model: Image, as: 'images' }],
    });

    res.status(200).json({ message: 'Order updated successfully', data: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(400).json({ error: error.message });
  }
}
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
      },
      { model: Image, as: 'images' },
      ],
      order: [['id', 'DESC']] // Orders by ID in descendin
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
        },
        { model: Image, as: 'images' },
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

const getOrdersByRiderOrMechant = async (req, res) => {
  const { merchantId, riderId, startDate, endDate } = req.body;
  logger.warn(`Merchant ${merchantId} rider ${riderId}`);

  try {
    if (!merchantId && !riderId) {
      return res.status(400).json({ message: 'Missing riderId or merchantId' });
    }

    // Build date condition
    const dateCondition = {};
    if (startDate && endDate) {
      dateCondition.createdAt = {
        [Op.between]: [
          new Date(`${startDate} 00:00:00`),
          new Date(`${endDate} 23:59:59`)
        ]
      };
    } else if (startDate) {
      dateCondition.createdAt = {
        [Op.gte]: new Date(`${startDate} 00:00:00`)
      };
    } else if (endDate) {
      dateCondition.createdAt = {
        [Op.lte]: new Date(`${endDate} 23:59:59`)
      };
    }

    // Fetch orders by riderId
    let riderOrders = [];
    if (riderId) {
      riderOrders = await OrderTable.findAll({
        where: {
          riderId,
          ...dateCondition
        },
        include: [
          {
            model: OrderPrice,
            as: 'orderPrices',
            include: [
              { model: Rider, as: 'rider' },
              { model: Merchant, as: 'merchant' }
            ]
          },
          { model: Merchant, as: 'merchant' }
        ]
      });
    }
    logger.warn(`riderOrders order ${riderOrders.length}`)

    // Fetch orders by merchantId
    let merchantOrders = [];
    if (merchantId) {
      merchantOrders = await OrderTable.findAll({
        where: {
          merchantId,
          ...dateCondition
        },
        include: [
          {
            model: OrderPrice,
            as: 'orderPrices',
            include: [
              { model: Rider, as: 'rider' },
              { model: Merchant, as: 'merchant' }
            ]
          },
          { model: Merchant, as: 'merchant' }
        ]
      });
    }
    logger.warn(`Merchant order ${merchantOrders.length}`)

    // Combine results and remove duplicates by order ID
    const allOrders = [...riderOrders, ...merchantOrders];
    const uniqueOrdersMap = new Map();
    allOrders.forEach(order => {
      uniqueOrdersMap.set(order.id, order);
    });

    const uniqueOrders = Array.from(uniqueOrdersMap.values());

    if (!uniqueOrders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json({ data: uniqueOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
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
