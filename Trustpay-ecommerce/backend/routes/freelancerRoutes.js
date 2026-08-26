const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  upsertProfile,
  requestVerification,
  createJob,
  hireFreelancer
} = require('../controllers/freelancerController');

router.use(protect);

router.post('/profile', upsertProfile);
router.post('/verify', requestVerification);
router.post('/jobs', createJob);
router.post('/hire', hireFreelancer);

module.exports = router;