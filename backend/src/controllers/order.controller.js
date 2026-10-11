const orderService = require('../services/order.service');
const { sendResponse, sendError } = require('../utils/apiResponse');

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, paymentReference, deliveryMethod, couponCode, customerNotes } = req.body;
    if (!shippingAddress || !shippingAddress.recipientName || !shippingAddress.phone || !shippingAddress.district || !shippingAddress.streetAddress) {
      return sendError(res, 400, 'Please provide complete delivery recipient name, phone, district, and address.');
    }

    const userId = req.user ? req.user._id : null;
    const isWholesaleOrder = req.user && req.user.role === 'Wholesale Customer';

    const order = await orderService.createOrder({
      userId,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentReference,
      deliveryMethod: deliveryMethod || 'Standard Parcel',
      couponCode,
      customerNotes,
      isWholesaleOrder
    });

    return sendResponse(res, 201, 'Order created successfully.', order);
  } catch (error) {
    next(error);
  }
};

const getCustomerOrders = async (req, res, next) => {
  try {
    const result = await orderService.getCustomerOrders(req.user._id, req.query);
    return sendResponse(res, 200, 'Orders retrieved', result.orders, result.pagination);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const userId = ['Admin', 'Super Admin', 'Manager'].includes(req.user.role) ? null : req.user._id;
    const order = await orderService.getOrderById(req.params.id, userId);
    return sendResponse(res, 200, 'Order details retrieved', order);
  } catch (error) {
    next(error);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const { phone } = req.query;
    const order = await orderService.trackOrder(orderNumber, phone);
    return sendResponse(res, 200, 'Order tracking details', order);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const result = await orderService.getAllOrders(req.query);
    return sendResponse(res, 200, 'All orders retrieved', result.orders, result.pagination);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, courierPartner, trackingNumber, note } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, {
      orderStatus,
      paymentStatus,
      courierPartner,
      trackingNumber,
      note,
      adminUserId: req.user._id
    });
    return sendResponse(res, 200, 'Order status updated successfully', order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getCustomerOrders,
  getOrderById,
  trackOrder,
  getAllOrders,
  updateOrderStatus
};
