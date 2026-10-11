const wishlistService = require('../services/wishlist.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const getWishlist = async (req, res, next) => {
  try {
    const products = await wishlistService.getWishlist(req.user._id);
    return sendResponse(res, 200, 'Wishlist retrieved', products);
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) return sendError(res, 400, 'Product id is required');
    const result = await wishlistService.toggleWishlist(req.user._id, productId);
    return sendResponse(res, 200, result.inWishlist ? 'Added to wishlist' : 'Removed from wishlist', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
