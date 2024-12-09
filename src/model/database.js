const { Sequelize } = require('sequelize');
const logger = require('../api/logger');
const env = require('../config/env').db;

// Main database
const dcExpressDB = new Sequelize(env.database, env.user, env.password, {
  host: env.host,
  dialect: 'mariadb',
  port: env.port,
  pool: { max: 10, min: 10, acquire: 30000, idle: 10000 },
});

// Authenticate
dcExpressDB.authenticate()
  .then(() => logger.info('client_db Connection established'))
  .catch(err => logger.error('client_db Connection error:', err));



module.exports = { dcExpressDB };
