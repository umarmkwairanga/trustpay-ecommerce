const MentorshipProgram = require('../models/MentorshipProgram');
const MentorshipEnrollment = require('../models/MentorshipEnrollment');
const MentorshipCertificate = require('../models/MentorshipCertificate');
const MentorshipCategory = require('../models/MentorshipCategory');
const CategoryRequest = require('../models/CategoryRequest');
const QRCode = require('qrcode'); // Standard QR generator library

// Register Mentor Profile
exports.registerMentor = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      professionalTitle, qualifications, institutionOrCompany,
      yearsOfExperience, expertise, biography, languages,
      categories, teachingExperience, verificationDocuments, bankInformation
    } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.role = 'mentor';
    user.mentorProfile = {
      professionalTitle,
      qualifications,
      institutionOrCompany,
      yearsOfExperience,
      expertise,
      biography,
      languages,
      categories,
      teachingExperience,
      verificationDocuments,
      bankInformation,
      verificationStatus: 'pending'
    };

    await user.save();
    res.status(200).json({ success: true, message: 'Mentor registration submitted successfully for verification', user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create Mentorship Program
exports.createProgram = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const programData = { ...req.body, mentor: mentorId };
    
    // Generate slug
    programData.slug = programData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const program = await MentorshipProgram.create(programData);
    res.status(201).json({ success: true, message: 'Mentorship program created successfully', program });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Enroll in Program with 10% Commission Calculation
exports.enrollProgram = async (req, res) => {
  try {
    const userId = req.user._id;
    const { programId, paymentType } = req.body;

    const program = await MentorshipProgram.findById(programId);
    if (!program) return res.status(404).json({ success: false, message: 'Program not found' });

    if (program.enrolledCount >= program.capacity) {
      return res.status(400).json({ success: false, message: 'PROGRAM FULL: Maximum capacity reached.' });
    }

    // Check existing enrollment
    const existing = await MentorshipEnrollment.findOne({ user: userId, program: programId });
    if (existing) return res.status(400).json({ success: false, message: 'Already enrolled in this program' });

    const price = program.price;
    const commissionRate = 0.10; // Default 10% TrustPay Commission
    const trustpayCommissionAmount = price * commissionRate;
    const mentorEarningsAmount = price - trustpayCommissionAmount;

    const enrollment = await MentorshipEnrollment.create({
      user: userId,
      program: programId,
      mentor: program.mentor,
      paymentStatus: price === 0 ? 'paid' : 'pending',
      amountDue: price,
      amountPaid: price === 0 ? 0 : price, // simulated immediate payment for testing flow
      balance: price === 0 ? 0 : 0,
      paymentType: paymentType || program.paymentType,
      trustpayCommissionAmount,
      mentorEarningsAmount,
      escrowStatus: 'held'
    });

    program.enrolledCount += 1;
    await program.save();

    res.status(201).json({ success: { message: 'Successfully enrolled', enrollment } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generate Certificate with Real Scannable QR Code
exports.generateCertificate = async (req, res) => {
  try {
    const { enrollmentId } = req.body;
    const enrollment = await MentorshipEnrollment.findById(enrollmentId).populate('program user mentor');
    if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });

    if (!enrollment.certificateEligible) {
      return res.status(400).json({ success: false, message: 'Mentee has not satisfied all certificate requirements' });
    }

    if (enrollment.certificateIssued) {
      return res.status(400).json({ success: false, message: 'Certificate already issued for this enrollment' });
    }

    const uniqueCertNumber = `TPE-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const verificationDomain = process.env.CLIENT_URL || 'https://trustpayecommerce.com';
    const verificationUrl = `${verificationDomain}/verify-certificate/${uniqueCertNumber}`;

    // Generate real scannable QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, { width: 300, margin: 2 });

    const certificate = await MentorshipCertificate.create({
      certificateNumber: uniqueCertNumber,
      enrollment: enrollment._id,
      user: enrollment.user._id,
      program: enrollment.program._id,
      mentor: enrollment.mentor._id,
      qrCodeDataUrl,
      verificationUrl,
      status: 'valid'
    });

    enrollment.certificateIssued = true;
    enrollment.certificateId = certificate._id;
    await enrollment.save();

    res.status(201).json({
      success: true,
      message: 'Certificate generated successfully with secure QR code',
      certificate
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Public Certificate Verification Endpoint
exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    const certificate = await MentorshipCertificate.findOne({ certificateNumber })
      .populate('user', 'name email')
      .populate('program', 'title duration')
      .populate('mentor', 'name mentorProfile.professionalTitle');

    if (!certificate) {
      return res.status(404).json({ success: false, status: 'INVALID', message: 'Invalid or nonexistent certificate ID.' });
    }

    if (certificate.status === 'revoked') {
      return res.status(200).json({
        success: true,
        status: 'REVOKED',
        message: 'This certificate has been officially revoked by TrustPayEcommerce administration.',
        revocationReason: certificate.revocationReason,
        certificateNumber: certificate.certificateNumber
      });
    }

    res.status(200).json({
      success: true,
      status: 'VALID',
      message: 'Certificate is authentic and valid.',
      data: {
        certificateNumber: certificate.certificateNumber,
        holderName: certificate.user.name,
        programTitle: certificate.program.title,
        mentorName: certificate.mentor.name,
        professionalTitle: certificate.mentor.mentorProfile?.professionalTitle,
        issueDate: certificate.issueDate,
        issuingOrganization: 'TrustPayEcommerce Mentorship & Learning'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};