const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true }, // e.g. WH-DINAJPUR-01, WH-DHAKA-CENTRAL
  district: { type: String, required: true },
  address: { type: String, required: true },
  capacityTons: { type: Number, default: 1000 },
  contactPerson: { type: String },
  phone: { type: String },
  email: { type: String },
  isCentral: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
