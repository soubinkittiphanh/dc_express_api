const express = require('express');
const router = express.Router();
const liveLocationController = require('./controller');
const {validateToken} = require('../../api').jwtApi
router.use(validateToken);
// Routes for LiveLocation CRUD operations
router.post('/live-locations', liveLocationController.createLiveLocation);
router.get('/live-locations', liveLocationController.getAllLiveLocations);
router.get('/live-locations/:id', liveLocationController.getLiveLocationById);
router.put('/live-locations/:id', liveLocationController.updateLiveLocation);
router.delete('/live-locations/:id', liveLocationController.deleteLiveLocation);

module.exports = router;
