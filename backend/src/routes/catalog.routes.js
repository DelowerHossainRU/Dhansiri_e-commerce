const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Categories
router.get('/categories', catalogController.getCategories);
router.post('/categories', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), catalogController.createCategory);
router.put('/categories/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), catalogController.updateCategory);
router.delete('/categories/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), catalogController.deleteCategory);

// Rice Varieties
router.get('/varieties', catalogController.getVarieties);
router.post('/varieties', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), catalogController.createVariety);
router.put('/varieties/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), catalogController.updateVariety);
router.delete('/varieties/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), catalogController.deleteVariety);

module.exports = router;
