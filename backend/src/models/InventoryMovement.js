const mongoose = require('mongoose');
const { INVENTORY_MOVEMENT_TYPES } = require('../config/constants');

const inventoryMovementSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  variantSku: { type: String, required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  type: { 
    type: String, 
    enum: Object.values(INVENTORY_MOVEMENT_TYPES), 
    required: true,
    index: true 
  },
  quantity: { type: Number, required: true }, // positive for additions, negative for deductions
  balanceAfter: { type: Number, required: true },
  referenceType: { type: String, enum: ['Order', 'PurchaseOrder', 'ReturnRequest', 'AuditAdjustment', 'TransferOrder'], default: 'AuditAdjustment' },
  referenceId: { type: String },
  reason: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

inventoryMovementSchema.index({ product: 1, createdAt: -1 });

module.exports = mongoose.model('InventoryMovement', inventoryMovementSchema);
