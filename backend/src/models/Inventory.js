const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  variantSku: { type: String, required: true, index: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true, index: true },
  stock: { type: Number, default: 0, min: 0 },
  reservedStock: { type: Number, default: 0, min: 0 },
  incomingStock: { type: Number, default: 0, min: 0 },
  damagedStock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 20 },
  lastRestockedAt: { type: Date }
}, { timestamps: true });

inventorySchema.virtual('availableStock').get(function() {
  return Math.max(0, this.stock - this.reservedStock);
});

inventorySchema.set('toJSON', { virtuals: true });
inventorySchema.set('toObject', { virtuals: true });
inventorySchema.index({ product: 1, variantSku: 1, warehouse: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
