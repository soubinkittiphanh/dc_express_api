const { dcExpressDB } = require('./database');
const { DataTypes } = require('sequelize');
const { Sequelize } = require('sequelize');
const logger = require('../api/logger');
// Load models
const db = {};
db.sequelizeDCExpress = dcExpressDB;
db.Sequelize = Sequelize;

// Example model imports
db.rider = require("../rider/model")(dcExpressDB, DataTypes);
db.kyc = require("../kyc/model")(dcExpressDB, DataTypes);
db.orders = require("../orders/model")(dcExpressDB, DataTypes);
db.merchant = require("../merchant/model")(dcExpressDB, DataTypes);

// Load associations
require('./associations/index')(db);

// Sync databases
dcExpressDB.sync({ force: false, alter: true }).then(async () => {
    logger.info("Database client is synchronized");
});

module.exports = db;
