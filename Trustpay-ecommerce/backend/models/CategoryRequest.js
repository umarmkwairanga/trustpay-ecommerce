const mongoose = require('mongoose');

const categoryRequestSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  categoryName: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  whatToTeach: { type: String, required: true },
  reasonNeeded: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CategoryRequest', categoryRequestSchema);