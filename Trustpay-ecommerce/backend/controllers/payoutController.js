const Flutterwave = import('flutterwave-node-v3');
const Withdrawal = import('../models/Withdrawal');
const Wallet = import('../models/Wallet');

// Initialize Flutterwave instance
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

exports.processPayout = async (req, res) => {
  const { withdrawalId } = req.body;

  try {
    // 1. Fetch the request from DB
    const withdrawal = await Withdrawal.findById(withdrawalId).populate('userId');
    if (!withdrawal || withdrawal.status !== 'Pending') {
      return res.status(400).json({ message: "Invalid or already processed request" });
    }

    // 2. Prepare payload for Flutterwave Transfer API
    // Note: 'bank_code' should be passed from the frontend selection
    const details = {
      account_bank: withdrawal.bankCode, 
      account_number: withdrawal.accountNumber,
      amount: withdrawal.amount,
      narration: `Payout for TrustPay User: ${withdrawal.userId.email}`,
      currency: "NGN",
      reference: `PAYOUT_${withdrawal._id}`, // Ensures unique tracking
    };

    // 3. Initiate Transfer
    const response = await flw.Transfer.initiate(details);

    if (response.status === 'success') {
      // 4. Update internal records to 'Completed'
      withdrawal.status = 'Completed';
      await withdrawal.save();

      res.status(200).json({ message: "Payout successful", data: response.data });
    } else {
      throw new Error(response.message || "Transfer failed");
    }

  } catch (err) {
    console.error("Payout Error:", err);
    res.status(500).json({ error: err.message });
  }
};