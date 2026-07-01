const Escrow = import('../models/Escrow');
const Wallet = import('../models/Wallet');
const { logAction } = import('../utils/auditHelper');
const { isValidTxRef } = import('../utils/referenceGenerator');

exports.handleFlutterwaveWebhook = async (req, res) => {
  // 1. Verify the signature (Hash)
  const secretHash = process.env.FLW_SECRET_HASH;
  const signature = req.headers['verif-hash'];

  if (!signature || signature !== secretHash) {
    return res.status(401).send("Unauthorized");
  }

  const { event, data } = req.body;

  // Validate the tx_ref format before processing
  if (!data || !isValidTxRef(data.tx_ref)) {
    return res.status(400).send("Invalid Transaction Reference");
  }

  try {
    // 2. Handle 'charge.completed' event
    if (event === 'charge.completed') {
      const { tx_ref, amount, status, currency } = data;

      if (status === 'successful') {
        // Find the escrow record
        const escrow = await Escrow.findOne({ tx_ref });

        // Only process if status is still 'Pending' to prevent double-processing
        if (escrow && escrow.status === 'Pending') {
          escrow.status = 'Funded';
          await escrow.save();

          // Log the automated action
          await logAction('SYSTEM', 'PAYMENT_RECEIVED', escrow._id, { 
            amount, 
            currency,
            tx_ref 
          });

          console.log(`Escrow ${escrow._id} successfully funded via Flutterwave.`);
        }
      }
    }

    // Always respond 200 to acknowledge receipt immediately
    // Flutterwave will retry if they don't receive a 200 OK
    res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook Error:", err);
    // Respond 500 so Flutterwave retries the event later
    res.status(500).send("Server Error");
  }
};