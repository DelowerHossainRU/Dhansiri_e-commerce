const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['ORDER_STATUS', 'PAYMENT_RECEIVED', 'WHOLESALE_APPROVAL', 'QUOTATION', 'SUPPORT_REPLY', 'LOW_STOCK', 'PROMOTION', 'SYSTEM'],
    default: 'ORDER_STATUS'
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false, index: true }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
