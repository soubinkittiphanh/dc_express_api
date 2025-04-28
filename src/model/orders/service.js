const OrderTable = require('..').orders; // Adjust the path to your models
const OrderPrice = require('..').orderPrice; // Adjust the path to your models
const Rider = require('..').rider; // Adjust the path to your models
const Merchant = require('..').merchant; // Adjust the path to your models
const Image = require('..').image; // Adjust the path to your models

const logger = require('../../api/logger');

const changeOrderStatus = async (id, status, t) => {
    try {
        const [updated] = await OrderTable.update({ status }, { where: { id } }, { transaction: t });

        if (!updated) {
            return 503;
        }

        const updatedOrder = await OrderTable.findByPk(id);
        logger.info(`Order status has been update successfully ${JSON.stringify(updatedOrder)}`)
        return 200
    } catch (error) {
        logger.error('Error updating order:', error);
        return 503
    }
};


const acceptOrder = async()=>{
    
}

module.exports = {
    changeOrderStatus
}