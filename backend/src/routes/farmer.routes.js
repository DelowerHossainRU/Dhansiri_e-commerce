const express = require('express');
const router = express.Router();
const farmerController = require('../controllers/farmer.controller');
const { protect, optionalAuth, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Public route for farmers to submit application to partner with Dhansiri Agro
router.post('/apply', optionalAuth, farmerController.applyFarmer);

// List farmers (public list of verified farmers or admin full view)
router.get('/', optionalAuth, farmerController.getFarmers);
router.get('/:id', optionalAuth, farmerController.getFarmerById);

// Admin / Sourcing manager routes
router.post('/', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), farmerController.createFarmer);
router.put('/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), farmerController.updateFarmer);
router.patch('/:id/verify', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), farmerController.updateVerification);

module.exports = router;
