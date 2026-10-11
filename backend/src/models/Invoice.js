const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [{
    productName: { type: String, required: true },
    variantTitle: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid', 'Partially Paid'], default: 'Unpaid' },
  paymentMethod: { type: String },
  issuedDate: { type: Date, default: Date.now },
  dueDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
