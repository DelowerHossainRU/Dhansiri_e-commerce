const mongoose = require('mongoose');
const { PRICING_TIERS } = require('../config/constants');

const wholesaleApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicantName: { type: String, required: true },
  companyName: { type: String, required: true },
  businessType: { 
    type: String, 
    enum: ['Hotel / Restaurant / Catering (HORECA)', 'Supermarket Chain', 'Wholesale Grain Merchant', 'Exporter', 'Institutional / Corporate Buyer', 'Retailer'], 
    required: true 
  },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String },
  address: { type: String, required: true },
  tradeLicenseNumber: { type: String, required: true },
  tradeLicenseFile: { type: String, default: '' },
  nidNumber: { type: String },
  nidFile: { type: String, default: '' },
  estimatedMonthlyTon: { type: Number, required: true },
  preferredVarieties: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'], 
    default: 'Pending',
    index: true 
  },
  assignedPricingTier: {
    type: String,
    enum: Object.values(PRICING_TIERS),
    default: PRICING_TIERS.WHOLESALE
  },
  approvedCreditLimit: { type: Number, default: 0 },
  paymentTermsDays: { type: Number, default: 0 },
  adminRemarks: { type: String },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('WholesaleApplication', wholesaleApplicationSchema);
