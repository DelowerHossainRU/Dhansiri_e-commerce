const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String },
  userName: { type: String },
  action: { type: String, required: true }, // e.g. 'PRODUCT_UPDATE', 'STOCK_ADJUSTED', 'WHOLESALE_APPROVED'
  module: { type: String, required: true }, // e.g. 'Products', 'Inventory', 'Orders', 'Wholesale', 'Settings'
  recordId: { type: String },
  details: { type: String },
  changes: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String }
}, { timestamps: true });

auditLogSchema.index({ module: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
