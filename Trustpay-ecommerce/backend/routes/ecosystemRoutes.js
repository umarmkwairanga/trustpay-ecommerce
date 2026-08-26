const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getMasterEcosystemReport } = require('../controllers/ecosystemController');

router.use(protect);
router.use(authorize('ceo', 'super_admin'));

router.get('/master-report', getMasterEcosystemReport);

module.exports = router;