const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth'); // Reuse your existing middleware
const { chat, generateQuiz, generateStudyPlan } = require('../controllers/mentorAIController');

// All routes require authentication
router.use(protect);

router.post('/chat', chat);
router.post('/quiz', generateQuiz);
router.post('/study-plan', generateStudyPlan);

module.exports = router;