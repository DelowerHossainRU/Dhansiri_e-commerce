const express = require('express');
const router = express.Router();
const qualityController = require('../controllers/quality.controller');
const { protect, optionalAuth, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Public route to view certified quality inspections (for traceability)
router.get('/', optionalAuth, qualityController.getInspections);
router.get('/:id', optionalAuth, qualityController.getInspectionById);

// Staff / Quality manager routes
router.post('/', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER, ROLES.STAFF), qualityController.createInspection);
router.put('/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), qualityController.updateInspection);

module.exports = router;
