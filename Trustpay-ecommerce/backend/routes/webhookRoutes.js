const express = import('express');
const router = express.Router();
const webhookController = import('../controllers/webhookController');

// This route must be public
router.post('/flutterwave', webhookController.handleFlutterwaveWebhook);

export default router;