const express = require('express');
const router = express.Router();
const imageController = require('./controller');

// Define routes for Image CRUD operations
router.post('/images', imageController.createImage);
router.get('/images', imageController.getAllImages);
router.get('/images/:id', imageController.getImageById);
router.put('/images/:id', imageController.updateImage);
router.delete('/images/:id', imageController.deleteImage);

module.exports = router;
