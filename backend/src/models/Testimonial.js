const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  author: { type: String, required: true },
  designation: { type: String, required: true }, // e.g. Executive Chef, Radisson Blu Dhaka / Procurement Head, Shwapno
  company: { type: String, required: true },
  quote: { type: String, required: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  avatar: { type: String },
  type: { type: String, enum: ['Institutional', 'Chef & Restaurant', 'Retail Consumer'], default: 'Institutional' },
  isFeatured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Testimonial', testimonialSchema);
