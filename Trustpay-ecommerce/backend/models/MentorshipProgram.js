const mongoose = require('mongoose');

const mentorshipProgramSchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'MentorshipCategory', required: true },
  description: { type: String, required: true },
  objectives: [{ type: String }],
  programType: {
    type: String,
    enum: ['1-on-1', 'group', 'masterclass', 'webinar', 'workshop', 'self-paced'],
    required: true
  },
  price: { type: Number, required: true, default: 0 },
  paymentType: {
    type: String,
    enum: ['free', 'one-time', 'installment', 'subscription'],
    required: true
  },
  installmentDetails: {
    totalPrice: { type: Number },
    numberOfInstallments: { type: Number },
    installmentAmount: { type: Number },
    dueDates: [{ type: Date }]
  },
  subscriptionDetails: {
    amount: { type: Number },
    billingPeriod: { type: String, enum: ['monthly', 'yearly'] }
  },
  duration: { type: String }, // e.g. "8 Weeks"
  numberOfSessions: { type: Number, default: 1 },
  startDate: { type: Date },
  endDate: { type: Date },
  capacity: { type: Number, default: 50 }, // Group capacity e.g. 500
  enrolledCount: { type: Number, default: 0 },
  curriculum: [{
    moduleTitle: { type: String },
    moduleDescription: { type: String },
    lessons: [{
      title: { type: String },
      content: { type: String },
      durationMinutes: { type: Number }
    }]
  }],
  requirements: {
    minAttendancePercentage: { type: Number, default: 80 },
    minModulesCompletedPercentage: { type: Number, default: 100 },
    requiredAssignmentsCompleted: { type: Boolean, default: true },
    minAssessmentScore: { type: Number, default: 60 }
  },
  certificateEnabled: { type: Boolean, default: true },
  refundPolicy: { type: String },
  status: {
    type: String,
    enum: ['draft', 'published', 'completed', 'cancelled'],
    default: 'draft'
  },
  coverImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MentorshipProgram', mentorshipProgramSchema);