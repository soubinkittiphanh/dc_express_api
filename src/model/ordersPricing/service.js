const logger = require('../../api/logger');

const OrderPrice = require('..').orderPrice; // Adjust the path to your models
// Check order price

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