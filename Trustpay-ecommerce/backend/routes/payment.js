const crypto = import('crypto');
const express = import('express');
const router = express.Router();

// Use your actual Secret Key from Paystack Dashboard
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

router.post('/paystack/webhook', (req, res) => {
    // 1. Verify the signature to ensure the request is actually from Paystack
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
        return res.sendStatus(403); // Forbidden
    }

    // 2. Acknowledge receipt immediately (important for Paystack)
    res.sendStatus(200);

    // 3. Process the event
    const event = req.body;
    if (event.event === 'charge.success') {
        const reference = event.data.reference;
        const amount = event.data.amount;
        
        console.log(`Payment successful for reference: ${reference}`);
        
        // TODO: Update your Transaction Status in MongoDB to 'held'
        // updateTransactionStatus(reference, 'held');
    }
});

export default router;