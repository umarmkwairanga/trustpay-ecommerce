const mongoose = require('mongoose');

const mentorshipEnrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Mentee (Buyer role)
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipProgram', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'installment_active', 'failed', 'refunded'],
    default: 'pending'
  },
  amountDue: { type: Number, required: true },
  amountPaid: { type: Number, default: 0 },
  balance: { type: Number, required: true },
  paymentType: { type: String, required: true },
  installmentsRecord: [{
    installmentNumber: { type: Number },
    amount: { type: Number },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
    paidAt: { type: Date }
  }],
  attendanceRecords: [{
    sessionId: { type: mongoose.Schema.Types.ObjectId },
    attended: { type: Boolean, default: false },
    joinedAt: { type: Date }
  }],
  modulesCompleted: [{ type: Number }], // module index array
  lessonsCompleted: [{ type: String }],
  assignmentsSubmitted: [{
    assignmentId: { type: mongoose.Schema.Types.ObjectId },
    submittedAt: { type: Date },
    fileUrl: { type: String },
    score: { type: Number },
    feedback: { type: String },
    status: { type: String, enum: ['submitted', 'graded', 'revision_required'], default: 'submitted' }
  }],
  overallProgressPercentage: { type: Number, default: 0 },
  completionStatus: {
    type: String,
    enum: ['enrolled', 'in_progress', 'completed', 'dropped'],
    default: 'enrolled'
  },
  certificateEligible: { type: Boolean, default: false },
  certificateIssued: { type: Boolean, default: false },
  certificateId: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipCertificate' },
  trustpayCommissionAmount: { type: Number, default: 0 },
  mentorEarningsAmount: { type: Number, default: 0 },
  escrowStatus: {
    type: String,
    enum: ['held', 'released', 'disputed', 'refunded'],
    default: 'held'
  }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipEnrollment', mentorshipEnrollmentSchema);