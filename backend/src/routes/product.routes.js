const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, optionalAuth, authorize } = require('../middleware/auth.middleware');
const { ROLES } = require('../config/constants');

// Public / Tier-aware showcase routes
router.get('/', optionalAuth, productController.getProducts);
router.get('/seasonal', optionalAuth, productController.getSeasonalProducts);
router.get('/fresh-harvest', optionalAuth, productController.getFreshHarvest);
router.get('/best-sellers', optionalAuth, productController.getBestSellers);
router.get('/slug/:slug', optionalAuth, productController.getProductBySlug);
router.get('/:id', optionalAuth, productController.getProductById);

// Admin / Manager routes
router.post('/', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), productController.createProduct);
router.put('/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.MANAGER), productController.updateProduct);
router.delete('/:id', protect, authorize(ROLES.ADMIN, ROLES.SUPER_ADMIN), productController.deleteProduct);

module.exports = router;
