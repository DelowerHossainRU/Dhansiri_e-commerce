const mongoose = require('mongoose');
const { PRICING_TIERS } = require('../config/constants');

const distributorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  companyName: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  district: { type: String, required: true },
  assignedTerritory: { type: String, required: true }, // e.g. 'Dhaka North & Gazipur', 'Chittagong Metro'
  address: { type: String, required: true },
  tradeLicenseNumber: { type: String, required: true },
  tradeLicenseFile: { type: String },
  nidFile: { type: String },
  existingDistributionOutletsCount: { type: Number, default: 0 },
  monthlyOrderCommitmentTons: { type: Number, default: 5 },
  pricingTier: { type: String, default: PRICING_TIERS.DISTRIBUTOR },
  creditLimit: { type: Number, default: 0 },
  creditPeriodDays: { type: Number, default: 15 },
  assignedSalesRep: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Active', 'Suspended', 'PendingApproval'], default: 'Active' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Distributor', distributorSchema);
