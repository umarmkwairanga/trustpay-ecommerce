import Wallet from '../models/Wallet.js';

// Get current balance
export const getBalance = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.user.id });
        res.status(200).json({ balance: wallet ? wallet.balance : 0 });
    } catch (error) {
        res.status(500).json({ message: "Error fetching balance" });
    }
};

// Process deposit (Adding money to the platform)
export const deposit = async (req, res) => {
    try {
        const { amount } = req.body;
        const wallet = await Wallet.findOneAndUpdate(
            { userId: req.user.id },
            { $inc: { balance: amount } },
            { new: true, upsert: true }
        );
        res.status(200).json({ message: "Deposit successful", balance: wallet.balance });
    } catch (error) {
        res.status(500).json({ message: "Deposit failed" });
    }
};