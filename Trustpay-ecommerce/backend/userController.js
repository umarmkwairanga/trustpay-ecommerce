const User = import('../models/User');
const axios = import('axios');

// Link Seller Bank Details to Paystack
exports.createTransferRecipient = async (req, res) => {
    try {
        const { account_number, bank_code, account_name } = req.body;
        const sellerId = req.user.id; 

        // 1. Get recipient code from Paystack
        const response = await axios.post('https://api.paystack.co/transferrecipient', {
            type: "nuban",
            name: account_name,
            account_number: account_number,
            bank_code: bank_code,
            currency: "NGN"
        }, {
            headers: { 
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const recipientCode = response.data.data.recipient_code;

        // 2. Save recipient code to the User model
        await User.findByIdAndUpdate(sellerId, { 
            paystackRecipientCode: recipientCode 
        });

        res.status(200).json({ 
            message: "Bank details linked successfully", 
            recipientCode 
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to link bank account", error: err.message });
    }
};