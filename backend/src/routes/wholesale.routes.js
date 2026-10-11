const express = require('express');
const router = express.Router();
const wholesaleController = require('../controllers/wholesale.controller');
const { protect, optionalAuth, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Applications
router.post('/apply', optionalAuth, wholesaleController.submitApplication);
router.get('/applications', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), wholesaleController.getApplications);
router.put('/applications/:id/review', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), wholesaleController.reviewApplication);

// Distributors
router.post('/distributor-apply', optionalAuth, wholesaleController.submitDistributorApplication);
router.get('/distributors', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), wholesaleController.getDistributors);

// Quotations
router.post('/quotation-request', optionalAuth, wholesaleController.requestQuotation);
router.get('/quotations', protect, wholesaleController.getQuotations);
router.get('/quotations/:id', protect, wholesaleController.getQuotationById);
router.put('/quotations/:id/status', protect, wholesaleController.updateQuotationStatus);

module.exports = router;
