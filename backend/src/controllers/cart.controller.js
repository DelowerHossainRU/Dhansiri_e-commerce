const cartService = require('../services/cart.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const getCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    const cart = await cartService.getOrCreateCart(userId, sessionId);
    return sendResponse(res, 200, 'Cart retrieved', cart);
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    const userTier = req.user ? req.user.pricingTier : 'retail';
    const { productId, variantSku, quantity } = req.body;

    if (!productId || !variantSku) {
      return sendError(res, 400, 'Product id and variant SKU are required.');
    }

    const cart = await cartService.addItem(userId, sessionId, { productId, variantSku, quantity, userTier });
    return sendResponse(res, 200, 'Item added to cart', cart);
  } catch (error) {
    next(error);
  }
};

const updateQty = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    const { itemId, quantity } = req.body;

    const cart = await cartService.updateItemQty(userId, sessionId, { itemId, quantity });
    return sendResponse(res, 200, 'Cart updated', cart);
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    const { itemId } = req.params;

    const cart = await cartService.removeItem(userId, sessionId, itemId);
    return sendResponse(res, 200, 'Item removed from cart', cart);
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.query.sessionId;
    const result = await cartService.clearCart(userId, sessionId);
    return sendResponse(res, 200, 'Cart cleared', result);
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    const { code } = req.body;
    if (!code) return sendError(res, 400, 'Please provide coupon code.');

    const cart = await cartService.applyCoupon(userId, sessionId, code);
    return sendResponse(res, 200, 'Coupon applied successfully', cart);
  } catch (error) {
    next(error);
  }
};

const removeCoupon = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const sessionId = req.headers['x-session-id'] || req.body.sessionId;
    const cart = await cartService.removeCoupon(userId, sessionId);
    return sendResponse(res, 200, 'Coupon removed', cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateQty,
  removeItem,
  clearCart,
  applyCoupon,
  removeCoupon
};
