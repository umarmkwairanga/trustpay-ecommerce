const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { purchaseAirtime } = require('../controllers/digitalServiceController');

router.use(protect);

router.post('/airtime/purchase', purchaseAirtime);

module.exports = router;