import Transaction from '../models/Escrow.js';
import BookingTransaction from '../models/BookingTransaction.js';

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
            const txRef = data.tx_ref;

            // 1. Try updating a standard product/escrow transaction first
            let updatedTransaction = await Transaction.findOneAndUpdate(
                { reference: txRef }, 
                { status: 'HELD', paymentReference: data.id }
            );

            if (updatedTransaction) {
                console.log(`Product Transaction ${txRef} moved to Escrow.`);
            } else {
                // 2. If not found in standard transactions, check BookingTransactions
                let updatedBooking = await BookingTransaction.findOneAndUpdate(
                    { bookingReference: txRef },
                    { 
                        paymentStatus: 'success', 
                        status: 'Confirmed', 
                        paymentReference: data.id,
                        escrowStatus: 'held'
                    }
                );

                if (updatedBooking) {
                    console.log(`Booking Transaction ${txRef} confirmed and funds secured in escrow.`);
                } else {
                    console.warn(`Webhook received for unknown reference: ${txRef}`);
                }
            }
        }

        return res.sendStatus(200);
    } catch (error) {
        console.error("Webhook Error:", error.message);
        return res.status(500).json({ message: "Webhook processing failed" });
    }
};