const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  banglaName: { type: String, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  district: { type: String, required: true },
  upazila: { type: String, required: true },
  village: { type: String },
  farmName: { type: String, required: true },
  farmLocation: { type: String },
  primaryCrops: [{ type: String }], // e.g. ['Mango', 'Litchi', 'Paddy', 'Corn', 'Vegetables']
  farmSizeAcres: { type: Number, default: 5 },
  estimatedAnnualCapacity: { type: String }, // e.g. '30 Metric Tons'
  experienceYears: { type: Number, default: 10 },
  verificationStatus: { 
    type: String, 
    enum: ['Pending', 'Verified', 'Rejected'], 
    default: 'Pending',
    index: true 
  },
  photo: { type: String, default: '' },
  documents: [{ type: String }],
  bio: { type: String },
  notes: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

farmerSchema.index({ district: 1, verificationStatus: 1 });

module.exports = mongoose.model('Farmer', farmerSchema);
