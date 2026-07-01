import Order from '../models/Order.js';

export const handleFlutterwaveWebhook = async (req, res) => {
    // 1. Verify that the request is actually from Flutterwave (using secret hash)
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    const signature = req.headers["verif-hash"];

    if (!signature || signature !== secretHash) {
        return res.status(401).send("Invalid signature");
    }

    const { event, data } = req.body;

    // 2. If the payment was successful
    if (event === 'charge.completed') {
        const { tx_ref, status, amount } = data;

        if (status === 'successful') {
            const order = await Order.findOne({ reference: tx_ref });

            if (order && order.status === 'pending') {
                // 3. Update the order status to 'paid'
                order.status = 'paid';
                order.paymentId = data.id.toString();
                await order.save();
                console.log(`[WEBHOOK]: Order ${tx_ref} marked as paid.`);
            }
        }
    }

    // 4. Always respond with 200 to Flutterwave
    res.status(200).send("Webhook received");
};