const mongoose = require('mongoose');

const mentorshipCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, lowercase: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipCategory', mentorshipCategorySchema);