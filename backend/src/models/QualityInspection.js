const mongoose = require('mongoose');

const qualityInspectionSchema = new mongoose.Schema({
  inspectionNumber: { type: String, required: true, unique: true, uppercase: true },
  batchNumber: { type: String, required: true, index: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  inspectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  inspectorName: { type: String, default: 'Senior Quality Officer' },
  inspectionDate: { type: Date, default: Date.now },
  moisturePercentage: { type: Number }, // e.g. 12.8%
  foreignMatterPercentage: { type: Number, default: 0.1 },
  brokenRatioPercentage: { type: Number },
  brixSweetnessDegree: { type: Number }, // for fruits e.g. 21 Brix
  qualityGrade: { 
    type: String, 
    default: 'Grade A - Export / Premium' 
  },
  status: { 
    type: String, 
    enum: ['Accepted', 'Partially Accepted', 'Rejected', 'Pending Review'], 
    default: 'Accepted',
    index: true 
  },
  sampleQuantityTested: { type: String, default: '5 kg random composite sample' },
  acceptedQuantity: { type: Number, default: 0 },
  rejectedQuantity: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  carbideFreeCertified: { type: Boolean, default: true },
  bstiCompliant: { type: Boolean, default: true },
  remarks: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('QualityInspection', qualityInspectionSchema);
