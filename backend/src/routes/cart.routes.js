const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { optionalAuth } = require('../middleware/auth.middleware');

router.get('/', optionalAuth, cartController.getCart);
router.post('/items', optionalAuth, cartController.addItem);
router.put('/items', optionalAuth, cartController.updateQty);
router.delete('/items/:itemId', optionalAuth, cartController.removeItem);
router.delete('/', optionalAuth, cartController.clearCart);
router.post('/coupon', optionalAuth, cartController.applyCoupon);
router.delete('/coupon', optionalAuth, cartController.removeCoupon);

module.exports = router;
