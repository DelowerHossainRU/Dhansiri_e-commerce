const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  inquiryType: { 
    type: String, 
    enum: ['General', 'Retail Order', 'Bulk Supply & Export', 'Distributorship', 'Press & Media'], 
    default: 'General' 
  },
  status: { type: String, enum: ['New', 'In Progress', 'Resolved'], default: 'New', index: true },
  replyNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
