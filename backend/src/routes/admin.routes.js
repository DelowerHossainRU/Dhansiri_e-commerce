const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const upload = require('../middleware/upload.middleware');
const { protect, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Media upload endpoint (used by CMS / Product images / documents)
router.post('/upload', protect, upload.single('file'), adminController.uploadFile);

// Admin dashboard metrics
router.get('/dashboard-metrics', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), adminController.getDashboardMetrics);

// Reports
router.get('/reports/sales', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), adminController.getSalesReport);
router.get('/reports/inventory', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), adminController.getInventoryReport);

// Coupons
router.get('/coupons', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), adminController.getCoupons);
router.post('/coupons', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.createCoupon);
router.put('/coupons/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.updateCoupon);
router.delete('/coupons/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), adminController.deleteCoupon);

// Audit logs
router.get('/audit-logs', protect, authorize(ROLES.SUPER_ADMIN), adminController.getAuditLogs);

module.exports = router;
