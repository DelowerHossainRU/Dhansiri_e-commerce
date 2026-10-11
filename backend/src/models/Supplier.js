const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  contactPerson: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  district: { type: String, required: true }, // Dinajpur, Bogura, Naogaon, Kushtia
  address: { type: String, required: true },
  riceVarietiesSupplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RiceVariety' }],
  paymentTerms: { type: String, default: 'Net 15 Days' },
  bankDetails: {
    bankName: { type: String },
    branchName: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String }
  },
  performanceRating: { type: Number, default: 5.0, min: 1, max: 5 },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
