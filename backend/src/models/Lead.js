const mongoose = require('mongoose');
const { LEAD_STAGES, LEAD_SOURCES } = require('../config/constants');

const leadActivitySchema = new mongoose.Schema({
  type: { type: String, enum: ['Call', 'Meeting', 'WhatsApp', 'Email', 'QuotationSent', 'Note'], default: 'Note' },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { _id: true });

const leadSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  district: { type: String },
  businessType: { type: String },
  source: { type: String, enum: Object.values(LEAD_SOURCES), default: LEAD_SOURCES.WEBSITE },
  stage: { type: String, enum: Object.values(LEAD_STAGES), default: LEAD_STAGES.NEW, index: true },
  estimatedMonthlyTons: { type: Number, default: 1 },
  estimatedDealValue: { type: Number, default: 0 },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nextFollowUpDate: { type: Date },
  notes: { type: String },
  activities: [leadActivitySchema]
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
