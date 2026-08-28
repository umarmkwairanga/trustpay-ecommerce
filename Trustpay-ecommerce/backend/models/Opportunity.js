const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployerProfile', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  requiredSkills: [String],
  location: { type: String, required: true },
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
  salaryRange: String,
  status: { type: String, enum: ['draft', 'published', 'closed'], default: 'published' }
}, { timestamps: true });

module.exports = mongoose.model('Opportunity', opportunitySchema);