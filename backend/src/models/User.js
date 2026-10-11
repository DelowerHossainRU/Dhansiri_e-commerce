const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, PRICING_TIERS } = require('../config/constants');

const addressSchema = new mongoose.Schema({
  title: { type: String, default: 'Home' }, // Home, Office, Mill, Warehouse
  recipientName: { type: String, required: true },
  phone: { type: String, required: true },
  division: { type: String, required: true },
  district: { type: String, required: true },
  upazila: { type: String },
  streetAddress: { type: String, required: true },
  postalCode: { type: String },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  phone: { type: String, required: true, trim: true },
  role: { 
    type: String, 
    enum: Object.values(ROLES), 
    default: ROLES.CUSTOMER,
    index: true
  },
  pricingTier: {
    type: String,
    enum: Object.values(PRICING_TIERS),
    default: PRICING_TIERS.RETAIL
  },
  // B2B Wholesale / Distributor specific
  businessProfile: {
    companyName: { type: String },
    businessType: { type: String }, // Supermarket, Hotel, Restaurant, Distributor, Retailer, Exporter
    tradeLicenseNumber: { type: String },
    tinOrNid: { type: String },
    tradeLicenseDocumentUrl: { type: String },
    creditLimit: { type: Number, default: 0 },
    paymentTermsDays: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false }
  },
  addresses: [addressSchema],
  avatar: { type: String, default: '' },
  isEmailVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  refreshToken: { type: String, select: false },
  status: { type: String, enum: ['Active', 'Suspended', 'PendingVerification'], default: 'Active' },
  customPermissions: [{ type: String }]
}, { 
  timestamps: true 
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
