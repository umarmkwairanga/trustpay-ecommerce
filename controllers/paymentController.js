import Transaction from '../models/Escrow.js';

export const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['verif-hash'];
        
        // Verify the request comes from Flutterwave
        if (!signature || signature !== process.env.FLW_SECRET_HASH) {
            return res.status(401).json({ message: "Unauthorized request" });
        }

        const { event, data } = req.body;

        // Check if the charge was successful
        if (event === 'charge.completed' && data.status === 'successful') {
            // Update the transaction status in your database
            await Transaction.findOneAndUpdate(
                { reference: data.tx_ref }, 
                { status: 'HELD' }
            );
            console.log(`Transaction ${data.tx_ref} moved to Escrow.`);
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error.message);
        res.status(500).json({ message: "Webhook processing failed" });
    }
};