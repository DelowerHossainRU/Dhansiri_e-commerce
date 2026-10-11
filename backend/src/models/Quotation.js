const mongoose = require('mongoose');

const quotationItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  variantSku: { type: String, required: true },
  bagQuantity: { type: Number, required: true },
  bagWeightKg: { type: Number, required: true },
  totalKg: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { _id: true });

const quotationSchema = new mongoose.Schema({
  quotationNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  district: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  items: [quotationItemSchema],
  subtotal: { type: Number, required: true },
  specialDiscount: { type: Number, default: 0 },
  deliveryCharge: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  validUntil: { type: Date, required: true },
  termsAndConditions: { type: String, default: '1. Prices include loading at mill warehouse.\n2. Payment terms: 50% advance upon PO confirmation, 50% upon delivery receipt.\n3. Goods inspected and sealed in moisture-proof packaging.' },
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Customer Accepted', 'Customer Rejected', 'Converted To Order'], 
    default: 'Sent',
    index: true 
  },
  convertedOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Quotation', quotationSchema);
