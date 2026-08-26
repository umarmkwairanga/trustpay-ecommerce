const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  upsertProfile,
  getRecommendedJobs,
  applyForJob
} = require('../controllers/opportunityController');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', upsertProfile);
router.get('/recommended', getRecommendedJobs);
router.post('/jobs/apply', applyForJob);

module.exports = router;