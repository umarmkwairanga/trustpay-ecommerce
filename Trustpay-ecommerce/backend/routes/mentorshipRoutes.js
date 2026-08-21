const express = require('express');
const router = express.Router();
const {
  registerMentor,
  createProgram,
  enrollProgram,
  generateCertificate,
  verifyCertificate
} = require('../controllers/mentorshipController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public routes
router.get('/verify-certificate/:certificateNumber', verifyCertificate);

// Protected routes
router.post('/register', protect, registerMentor);
router.post('/programs', protect, restrictTo('mentor', 'admin', 'super_admin'), createProgram);
router.post('/enroll', protect, enrollProgram);
router.post('/certificates/generate', protect, restrictTo('mentor', 'admin', 'super_admin'), generateCertificate);

module.exports = router;