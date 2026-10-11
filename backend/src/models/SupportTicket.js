const mongoose = require('mongoose');
const { SUPPORT_STATUSES } = require('../config/constants');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, required: true },
  message: { type: String, required: true },
  attachment: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Order Issue', 'Delivery Delay', 'Product Quality / Moisture Query', 'Wholesale Inquiry', 'Payment & Invoice', 'Account', 'Other'],
    default: 'Order Issue'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: { type: String, enum: Object.values(SUPPORT_STATUSES), default: SUPPORT_STATUSES.OPEN, index: true },
  orderNumber: { type: String },
  messages: [messageSchema],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
