const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Coupon = require('../models/Coupon');
const Inventory = require('../models/Inventory');
const InventoryMovement = require('../models/InventoryMovement');
const Warehouse = require('../models/Warehouse');
const Notification = require('../models/Notification');
const { ORDER_STATUSES, PAYMENT_STATUSES, INVENTORY_MOVEMENT_TYPES, ROLES } = require('../config/constants');

class OrderService {
  async createOrder({ userId, customerData, items, shippingAddress, paymentMethod, paymentReference, deliveryMethod = 'Standard Parcel', couponCode, customerNotes, isWholesaleOrder = false }) {
    if (!items || !items.length) {
      const error = new Error('Order must contain at least one item.');
      error.statusCode = 400;
      throw error;
    }

    // Default fulfillment warehouse
    const defaultWarehouse = await Warehouse.findOne({ isActive: true }) || null;

    let subtotal = 0;
    let totalWeightKg = 0;
    const validatedItems = [];

    // Verify stock and calculate verified totals
    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      if (!product) {
        const error = new Error(`Product not found.`);
        error.statusCode = 404;
        throw error;
      }

      const variant = product.variants.find(v => v.variantSku === item.variantSku);
      if (!variant) {
        const error = new Error(`Variant ${item.variantSku} not found.`);
        error.statusCode = 404;
        throw error;
      }

      if (variant.stock < item.quantity) {
        const error = new Error(`Insufficient stock for ${product.name} (${variant.title}). Available: ${variant.stock}`);
        error.statusCode = 400;
        throw error;
      }

      const unitPrice = item.unitPrice || variant.retailPrice;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;
      totalWeightKg += (variant.weightKg || variant.quantityOrWeight || 1) * item.quantity;

      validatedItems.push({
        product: product._id,
        productName: product.name,
        variantSku: variant.variantSku,
        variantTitle: `${product.name} - ${variant.title}`,
        unit: variant.unit || 'kg',
        quantityOrWeight: variant.quantityOrWeight || 1,
        packagingType: variant.packagingType || 'Standard',
        weightKg: variant.weightKg || variant.quantityOrWeight || 1,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal,
        image: variant.image || product.featuredImage
      });
    }

    // Calculate coupon discount
    let couponDiscount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() <= new Date(coupon.validUntil) && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'Percentage') {
          couponDiscount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount > 0 && couponDiscount > coupon.maxDiscountAmount) {
            couponDiscount = coupon.maxDiscountAmount;
          }
        } else {
          couponDiscount = coupon.discountValue;
        }
        couponDiscount = Math.round(couponDiscount);
        coupon.usedCount += 1;
        if (userId) coupon.usedByUsers.push(userId);
        await coupon.save();
      }
    }

    // Delivery charge: inside Dhaka 80 BDT, outside 150 BDT, free over 2500 BDT
    const isInsideDhaka = (shippingAddress.district || '').toLowerCase().includes('dhaka');
    let deliveryCharge = isInsideDhaka ? 80 : 150;
    if (subtotal >= 2500) deliveryCharge = 0;
    if (isWholesaleOrder) {
      // Bulk orders delivery charge calculated based on weight (e.g. 2 BDT per kg)
      deliveryCharge = Math.max(500, Math.round(totalWeightKg * 2));
    }

    const grandTotal = Math.max(0, subtotal - couponDiscount + deliveryCharge);

    // Generate Order Number: DHA-YYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `DHA-${dateStr}-${randomSuffix}`;
    const invoiceNumber = `INV-${dateStr}-${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      invoiceNumber,
      customer: userId,
      items: validatedItems,
      totalWeightKg,
      subtotal,
      couponDiscount,
      couponCode: couponDiscount > 0 ? couponCode.toUpperCase() : undefined,
      deliveryCharge,
      grandTotal,
      shippingAddress,
      deliveryMethod,
      paymentMethod,
      paymentReference,
      warehouse: defaultWarehouse ? defaultWarehouse._id : undefined,
      customerNotes,
      isWholesaleOrder,
      timeline: [
        {
          status: ORDER_STATUSES.PENDING,
          note: `Order registered via online platform with ${paymentMethod}.`,
          timestamp: new Date()
        }
      ]
    });

    // Deduct stock and record inventory movement
    for (const item of validatedItems) {
      await Product.updateOne(
        { _id: item.product, 'variants.variantSku': item.variantSku },
        { $inc: { 'variants.$.stock': -item.quantity } }
      );

      if (defaultWarehouse) {
        await Inventory.findOneAndUpdate(
          { product: item.product, variantSku: item.variantSku, warehouse: defaultWarehouse._id },
          { $inc: { stock: -item.quantity } },
          { upsert: true }
        );

        await InventoryMovement.create({
          product: item.product,
          variantSku: item.variantSku,
          warehouse: defaultWarehouse._id,
          type: INVENTORY_MOVEMENT_TYPES.SALE,
          quantity: -item.quantity,
          balanceAfter: 0,
          referenceType: 'Order',
          referenceId: orderNumber,
          reason: `Online order ${orderNumber} customer dispatch`,
          performedBy: userId
        });
      }
    }

    // Generate commercial invoice
    await Invoice.create({
      invoiceNumber,
      order: order._id,
      customer: userId,
      customerName: shippingAddress.recipientName,
      customerPhone: shippingAddress.phone,
      customerAddress: `${shippingAddress.streetAddress}, ${shippingAddress.upazila || ''}, ${shippingAddress.district}`,
      items: validatedItems.map(i => ({
        productName: i.productName,
        variantTitle: i.variantTitle,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice
      })),
      subtotal,
      discount: couponDiscount,
      deliveryCharge,
      grandTotal,
      paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Unpaid' : 'Unpaid',
      paymentMethod,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    });

    // Create In-App Notification
    if (userId) {
      await Notification.create({
        user: userId,
        title: `Order Placed Successfully (#${orderNumber})`,
        message: `Your rice order amounting to ৳${grandTotal.toLocaleString()} has been received. Our team will verify and dispatch promptly.`,
        type: 'ORDER_STATUS',
        link: `/account/orders/${order._id}`
      });
    }

    // If customer has a cart, clear it
    if (userId) {
      await Cart.findOneAndUpdate({ user: userId }, { items: [], appliedCoupon: undefined });
    }

    return order;
  }

  async getOrderById(orderId, userId = null) {
    const filter = { _id: orderId };
    if (userId) filter.customer = userId;

    const order = await Order.findOne(filter)
      .populate('items.product', 'name slug featuredImage')
      .populate('warehouse', 'name code district');

    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }
    return order;
  }

  async trackOrder(orderNumber, phone = null) {
    const filter = { orderNumber: orderNumber.trim().toUpperCase() };
    if (phone) {
      filter['shippingAddress.phone'] = { $regex: phone.slice(-10), $options: 'i' };
    }

    const order = await Order.findOne(filter)
      .select('orderNumber orderStatus paymentStatus paymentMethod items grandTotal deliveryCharge timeline courierPartner trackingNumber createdAt');

    if (!order) {
      const error = new Error('No order found matching the provided order number.');
      error.statusCode = 404;
      throw error;
    }
    return order;
  }

  async getCustomerOrders(userId, query = {}) {
    const { page = 1, limit = 10 } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments({ customer: userId });
    const orders = await Order.find({ customer: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getAllOrders(query = {}) {
    const { status, paymentStatus, search, page = 1, limit = 15 } = query;
    const filter = {};

    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.recipientName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .populate('customer', 'name email phone role pricingTier')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    return {
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async updateOrderStatus(orderId, { orderStatus, paymentStatus, courierPartner, trackingNumber, note, adminUserId }) {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new Error('Order not found.');
      error.statusCode = 404;
      throw error;
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      order.timeline.push({
        status: orderStatus,
        note: note || `Order status updated to ${orderStatus}.`,
        timestamp: new Date(),
        updatedBy: adminUserId
      });

      // Notify customer
      await Notification.create({
        user: order.customer,
        title: `Order Status: ${orderStatus}`,
        message: `Your order #${order.orderNumber} is now ${orderStatus}.`,
        type: 'ORDER_STATUS',
        link: `/account/orders/${order._id}`
      });

      // Update invoice payment status if order delivered with COD
      if (orderStatus === ORDER_STATUSES.DELIVERED && order.paymentMethod === 'Cash on Delivery') {
        order.paymentStatus = PAYMENT_STATUSES.PAID;
        await Invoice.findOneAndUpdate({ order: order._id }, { paymentStatus: 'Paid' });
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      await Invoice.findOneAndUpdate({ order: order._id }, { paymentStatus });
    }

    if (courierPartner) order.courierPartner = courierPartner;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    await order.save();
    return order;
  }
}

module.exports = new OrderService();
