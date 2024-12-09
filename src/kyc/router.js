const express = require('express');
const router = express.Router();
const kycController = require('./controller');

// Define routes for KYC CRUD operations
router.post('/kycs', kycController.createKYC);
router.get('/kycs', kycController.getAllKYC);
router.get('/kycs/:id', kycController.getKYCById);
router.put('/kycs/:id', kycController.updateKYC);
router.delete('/kycs/:id', kycController.deleteKYC);

module.exports = router;
