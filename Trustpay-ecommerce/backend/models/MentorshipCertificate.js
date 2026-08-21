const mongoose = require('mongoose');

const mentorshipCertificateSchema = new mongoose.Schema({
  certificateNumber: { type: String, required: true, unique: true }, // e.g. TPE-2026-000001
  enrollment: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipEnrollment', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipProgram', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  qrCodeDataUrl: { type: String, required: true }, // Base64 or image URL of QR code
  verificationUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ['valid', 'revoked'],
    default: 'valid'
  },
  revocationReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipCertificate', mentorshipCertificateSchema);