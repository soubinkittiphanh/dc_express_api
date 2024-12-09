// Import all your association files
const kycAssociations = require('./kyc');
const imageAssociations = require('./image');


module.exports = (db) => {
  kycAssociations(db);
  imageAssociations(db);
};