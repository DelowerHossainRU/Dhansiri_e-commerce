const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'Agricultural Insights' },
  tags: [{ type: String }],
  featuredImage: { type: String, required: true },
  author: { type: String, default: 'Dhansiri Agronomy Team' },
  readTimeMinutes: { type: Number, default: 4 },
  isPublished: { type: Boolean, default: true, index: true },
  publishedAt: { type: Date, default: Date.now },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
