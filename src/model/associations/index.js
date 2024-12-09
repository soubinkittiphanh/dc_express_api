// Import all your association files
const kycAssociations = require('./kyc');


module.exports = (db) => {
  kycAssociations(db);
};