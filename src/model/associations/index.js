// Import all your association files
const kycAssociations = require('./kyc');
const imageAssociations = require('./image');
const userAssociations = require('./user');
const riderAssociations = require('./rider');
const merchantAssociations = require('./merchant');
const orderPriceAssociations = require('./order-price');
const orderAssociations = require('./order');


module.exports = (db) => {
  kycAssociations(db);
  imageAssociations(db);
  userAssociations(db);
  riderAssociations(db);
  merchantAssociations(db);
  orderPriceAssociations(db);
  orderAssociations(db);
};