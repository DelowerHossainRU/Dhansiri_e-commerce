const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  banglaName: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  description: { type: String },
  image: { type: String, default: '' },
  icon: { type: String, default: 'Apple' }, // Lucide icon name
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isSeasonal: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

categorySchema.index({ slug: 1, isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
