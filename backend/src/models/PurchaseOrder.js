const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  variantSku: { type: String, required: true },
  riceVariety: { type: mongoose.Schema.Types.ObjectId, ref: 'RiceVariety' },
  bagQuantity: { type: Number, required: true },
  bagWeightKg: { type: Number, required: true },
  totalKg: { type: Number, required: true },
  unitCostPerKg: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  receivedBagQuantity: { type: Number, default: 0 },
  qualityGrade: { type: String, default: 'Grade A - Premium Sortex' }
}, { _id: true });

const purchaseOrderSchema = new mongoose.Schema({
  poNumber: { type: String, required: true, unique: true, uppercase: true, index: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
  items: [purchaseItemSchema],
  subtotal: { type: Number, required: true },
  transportCost: { type: Number, default: 0 },
  laborCost: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Sent', 'Partially Received', 'Received', 'Cancelled'], 
    default: 'Draft',
    index: true 
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Paid'],
    default: 'Pending'
  },
  supplierInvoiceNumber: { type: String },
  notes: { type: String },
  expectedDeliveryDate: { type: Date },
  receivedAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
