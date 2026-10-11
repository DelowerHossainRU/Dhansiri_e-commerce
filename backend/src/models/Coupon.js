const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  title: { type: String, required: true },
  discountType: { type: String, enum: ['Percentage', 'FixedAmount'], default: 'Percentage' },
  discountValue: { type: Number, required: true }, // e.g. 10 (%) or 150 (BDT)
  minOrderAmount: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: 0 }, // 0 means uncapped
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number, default: 100 },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  usedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isWholesaleOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
