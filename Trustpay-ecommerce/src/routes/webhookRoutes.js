import express from 'express';
import { handleFlutterwaveWebhook } from '../controllers/webhookController.js';
import bodyParser from 'body-parser';

const router = express.Router();
// Webhooks MUST use raw body parsing to verify the signature correctly
router.post('/flutterwave', bodyParser.json(), handleFlutterwaveWebhook);
export default router;