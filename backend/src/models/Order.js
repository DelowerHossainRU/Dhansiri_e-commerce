const mongoose = require('mongoose');
const { ORDER_STATUSES, PAYMENT_STATUSES, PAYMENT_METHODS } = require('../config/constants');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  variantSku: { type: String, required: true },
  variantTitle: { type: String, required: true },
  unit: { type: String, default: 'kg' },
  quantityOrWeight: { type: Number, default: 1 },
  packagingType: { type: String },
  weightKg: { type: Number, default: 1 },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  image: { type: String }
}, { _id: true });

const statusTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String },
  timestamp: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: [orderItemSchema],
  totalWeightKg: { type: Number, default: 0 },
  subtotal: { type: Number, required: true },
  discountTotal: { type: Number, default: 0 },
  couponDiscount: { type: Number, default: 0 },
  couponCode: { type: String },
  deliveryCharge: { type: Number, default: 0 },
  deliveryMethod: { type: String, default: 'Standard Parcel' },
  taxAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  shippingAddress: {
    recipientName: { type: String, required: true },
    phone: { type: String, required: true },
    division: { type: String, required: true },
    district: { type: String, required: true },
    upazila: { type: String },
    streetAddress: { type: String, required: true },
    postalCode: { type: String }
  },
  billingAddress: {
    recipientName: { type: String },
    phone: { type: String },
    district: { type: String },
    streetAddress: { type: String }
  },
  orderStatus: {
    type: String,
    enum: Object.values(ORDER_STATUSES),
    default: ORDER_STATUSES.PENDING,
    index: true
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PAYMENT_STATUSES),
    default: PAYMENT_STATUSES.PENDING,
    index: true
  },
  paymentMethod: {
    type: String,
    enum: Object.values(PAYMENT_METHODS),
    default: PAYMENT_METHODS.COD
  },
  paymentReference: { type: String }, // TrxID or bank slip reference
  statusTimeline: [statusTimelineSchema],
  trackingNumber: { type: String },
  courierPartner: { type: String, default: 'Dhansiri Agri-Express' },
  customerNotes: { type: String },
  adminNotes: { type: String },
  invoiceNumber: { type: String },
  isWholesaleOrder: { type: Boolean, default: false },
  estimatedDeliveryDate: { type: Date }
}, { 
  timestamps: true 
});

orderSchema.index({ orderNumber: 1, customer: 1 });
orderSchema.index({ orderStatus: 1, paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
