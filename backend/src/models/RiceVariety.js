const mongoose = require('mongoose');

const riceVarietySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  banglaName: { type: String, trim: true },
  code: { type: String, uppercase: true, trim: true }, // e.g. CHN-01, MIN-02
  originRegion: { type: String, trim: true }, // e.g., Dinajpur, Bogura, Barishal, Sherpur
  grainType: { 
    type: String, 
    enum: ['Long Grain', 'Medium Grain', 'Short Grain', 'Aromatic Fine Grain', 'Slender Grain'], 
    default: 'Long Grain' 
  },
  processingType: {
    type: String,
    enum: ['Parboiled (Siddha)', 'Non-Parboiled (Atap)', 'Brown Unpolished', 'Single Boiled', 'Steamed (Double Polished)'],
    default: 'Parboiled (Siddha)'
  },
  aromaLevel: { type: String, enum: ['High Natural Aroma', 'Mild Aroma', 'Non-Aromatic'], default: 'Non-Aromatic' },
  grainLengthMm: { type: Number },
  amylosePercentage: { type: Number }, // e.g. 24% for fluffy non-sticky texture
  description: { type: String },
  idealForDishes: [{ type: String }], // e.g., 'Kacchi Biryani', 'Daily Khichuri', 'Payesh / Polao', 'Steamed Rice'
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

riceVarietySchema.index({ name: 1, isActive: 1 });

module.exports = mongoose.model('RiceVariety', riceVarietySchema);
