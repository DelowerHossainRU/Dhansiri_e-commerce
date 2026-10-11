const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, wishlistController.getWishlist);
router.post('/toggle', protect, wishlistController.toggleWishlist);

module.exports = router;
