const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String },
  fileType: { type: String, enum: ['image', 'document', 'video'], default: 'image' },
  fileSize: { type: Number }, // in bytes
  mimeType: { type: String },
  altText: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);
