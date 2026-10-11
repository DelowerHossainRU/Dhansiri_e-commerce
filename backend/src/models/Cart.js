const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantSku: { type: String, required: true },
  variantTitle: { type: String, required: true },
  unit: { type: String, default: 'kg' },
  quantityOrWeight: { type: Number, default: 1 },
  weightKg: { type: Number, default: 1 },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true },
  image: { type: String }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  sessionId: { type: String, index: true }, // for guest cart persistence
  items: [cartItemSchema],
  appliedCoupon: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 },
    discountType: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
