const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect, optionalAuth, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Public order tracking
router.get('/track/:orderNumber', orderController.trackOrder);

// Customer checkout and personal orders
router.post('/', optionalAuth, orderController.createOrder);
router.get('/my-orders', protect, orderController.getCustomerOrders);
router.get('/:id', protect, orderController.getOrderById);

// Admin / Staff operations
router.get('/', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF), orderController.getAllOrders);
router.put('/:id/status', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF), orderController.updateOrderStatus);

module.exports = router;
