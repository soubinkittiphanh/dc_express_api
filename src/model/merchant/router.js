const express = require('express');
const router = express.Router();
const merchantController = require('./controller');
const {validateToken} = require('../../api').jwtApi
router.use(validateToken);
// Define routes for Merchant CRUD operations
router.post('/merchants', merchantController.createMerchant);
router.get('/merchants', merchantController.getAllMerchants);
router.get('/merchants/:id', merchantController.getMerchantById);
router.put('/merchants/:id', merchantController.updateMerchant);
router.delete('/merchants/:id', merchantController.deleteMerchant);

module.exports = router;
