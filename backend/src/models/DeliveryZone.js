const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema({
  zoneName: { type: String, required: true }, // e.g. 'Inside Dhaka City', 'Dhaka Suburbs (Gazipur/Narayanganj)', 'Chittagong Metro', 'All Other Districts (Nationwide)'
  districts: [{ type: String }], // List of districts covered
  baseFee: { type: Number, required: true }, // BDT
  freeDeliveryThreshold: { type: Number, default: 2500 }, // Free delivery over BDT 2500 for retail
  estimatedDeliveryHours: { type: String, default: '24-48 Hours' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
