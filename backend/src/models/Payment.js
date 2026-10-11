const mongoose = require('mongoose');
const { PAYMENT_STATUSES, PAYMENT_METHODS } = require('../config/constants');

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'BDT' },
  method: { type: String, enum: Object.values(PAYMENT_METHODS), required: true },
  status: { type: String, enum: Object.values(PAYMENT_STATUSES), default: PAYMENT_STATUSES.PENDING },
  transactionId: { type: String, index: true },
  senderPhone: { type: String }, // For bKash/Nagad/Rocket
  bankReference: { type: String }, // For Bank transfer / Cheque
  receiptImage: { type: String },
  gatewayResponse: { type: mongoose.Schema.Types.Mixed },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
