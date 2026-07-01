import express from 'express';
const router = express.Router();

router.post('/flutterwave', (req, res) => {
    // This logs the webhook to your terminal
    console.log("--- WEBHOOK RECEIVED ---");
    console.log("Payload:", JSON.stringify(req.body, null, 2));

    // Flutterwave expects a 200 OK response to confirm receipt
    res.status(200).send('Webhook received successfully');
});

export default router;