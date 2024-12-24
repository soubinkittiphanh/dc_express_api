const express = require('express');
const router = express.Router();
const orderController = require('./controller');
const { validateToken } = require('../../api').jwtApi
const multer = require('multer');
const path = require('path');
const logger = require('../../api/logger');


// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../../../upload'); // Adjust as needed
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

        // Log the file type for debugging
        logger.info(`Received file type: ${file.mimetype}`);
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});
router.use(validateToken);
// Define routes for Order CRUD operations
router.post('/create',upload.array('images'), orderController.createOrder);
router.get('/find', orderController.getAllOrders);
router.get('/find/:id', orderController.getOrderById);
router.put('/update/:id', orderController.updateOrder);
router.delete('/delete/:id', orderController.deleteOrder);

module.exports = router;
