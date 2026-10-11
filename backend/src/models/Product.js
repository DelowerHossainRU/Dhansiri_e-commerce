const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variantSku: { type: String, required: true, trim: true },
  title: { type: String, required: true }, // e.g. '5 Kg Wooden Crate', '25 Kg Master Sack', '1 Metric Ton Bulk'
  unit: { 
    type: String, 
    enum: ['kg', 'g', 'piece', 'box', 'crate', 'sack', 'bag', 'metric ton', 'dozen', 'bunch', 'bundle', 'liter'], 
    default: 'kg' 
  },
  quantityOrWeight: { type: Number, required: true }, // e.g. 1, 5, 10, 25, 50, 100, 1000
  packagingType: { 
    type: String, 
    default: 'Food-Grade Jute Bag' 
  },
  retailPrice: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  wholesalePrice: { type: Number, required: true },
  distributorPrice: { type: Number, required: true },
  corporatePrice: { type: Number },
  stock: { type: Number, default: 0 },
  reservedStock: { type: Number, default: 0 },
  minWholesaleQty: { type: Number, default: 5 },
  barcode: { type: String },
  image: { type: String, default: '' }
}, { _id: true });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  banglaName: { type: String, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  subcategory: { type: String },
  brand: { type: String, default: 'Dhansiri Agro' },
  variety: { type: String, trim: true }, // e.g., 'Himsagar', 'Bedana', 'Miniket', 'China-3', 'Hybrid Maize-301'
  riceVariety: { type: mongoose.Schema.Types.ObjectId, ref: 'RiceVariety', required: false, index: true },
  origin: { type: String, default: 'Dinajpur, Bangladesh' },
  district: { type: String, default: 'Dinajpur' },
  upazila: { type: String },
  productType: { 
    type: String, 
    enum: [
      'Fresh Fruits', 
      'Vegetables', 
      'Grains & Cereals', 
      'Rice Products', 
      'Pulses & Legumes', 
      'Spices', 
      'Seeds & Planting Materials', 
      'Agricultural Produce'
    ],
    default: 'Rice Products',
    index: true
  },
  // Seasonal Product Management
  isSeasonal: { type: Boolean, default: false, index: true },
  seasonalInfo: {
    seasonName: { type: String }, // e.g. 'Baishakhi Summer Harvest 2026'
    seasonStart: { type: Date },
    seasonEnd: { type: Date },
    expectedHarvestDate: { type: Date },
    preOrderOpenDate: { type: Date },
    preOrderCloseDate: { type: Date },
    estimatedDelivery: { type: String },
    availabilityStatus: { 
      type: String, 
      enum: ['Available Now', 'Coming Soon', 'Pre-order Open', 'Temporarily Unavailable', 'Out of Season', 'Sold Out'],
      default: 'Available Now',
      index: true
    }
  },
  // Farm-to-Customer Traceability
  traceability: {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    farmerName: { type: String },
    farmName: { type: String },
    district: { type: String },
    upazila: { type: String },
    harvestBatch: { type: String },
    harvestDate: { type: Date },
    procurementDate: { type: Date },
    qualityGrade: { type: String, default: 'Grade A - Premium Sortex' },
    storageConditions: { type: String, default: 'Controlled Temperature & Moisture-Sealed' }
  },
  attributes: [{
    name: { type: String, required: true },
    value: { type: String, required: true }
  }],
  images: [{ type: String }],
  featuredImage: { type: String, required: true },
  videoUrl: { type: String, default: '' },
  variants: [variantSchema],
  nutritionalInfo: {
    caloriesPer100g: { type: Number, default: 350 },
    carbohydratesG: { type: Number, default: 78 },
    proteinG: { type: Number, default: 7.2 },
    fatG: { type: Number, default: 0.6 },
    fiberG: { type: Number, default: 1.4 },
    ironMg: { type: Number, default: 1.2 }
  },
  shelfLife: { type: String, default: '12 Months' },
  harvestPeriod: { type: String },
  storageAdvice: { type: String, default: 'Store in an airtight container in a cool, dry place.' },
  certifications: [{ type: String }],
  tags: [{ type: String }],
  rating: { type: Number, default: 5.0, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false, index: true },
  isBestSeller: { type: Boolean, default: false, index: true },
  isWholesaleAvailable: { type: Boolean, default: true },
  status: { type: String, enum: ['Published', 'Draft', 'Archived'], default: 'Published', index: true },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }]
  }
}, { 
  timestamps: true 
});

productSchema.index({ name: 'text', banglaName: 'text', shortDescription: 'text', variety: 'text', tags: 'text' });
productSchema.index({ status: 1, category: 1, isSeasonal: 1, isFeatured: 1 });

module.exports = mongoose.model('Product', productSchema);
