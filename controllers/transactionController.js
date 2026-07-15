import Transaction from '../models/Transaction.js';

// 1. Log a new transaction (When payment starts)
export const logTransaction = async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        const savedTransaction = await newTransaction.save();
        res.status(201).json({ message: "Transaction logged", transaction: savedTransaction });
    } catch (error) {
        res.status(500).json({ message: "Error logging transaction", error: error.message });
    }
};

// 2. Update transaction status (HELD, RELEASED, etc.)
export const updateTransactionStatus = async (req, res) => {
    try {
        const { transactionId, status } = req.body;
        const transaction = await Transaction.findByIdAndUpdate(
            transactionId, 
            { status }, 
            { new: true }
        );
        res.status(200).json({ message: "Transaction updated", transaction });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// 3. Get transaction history for a user
export const getHistory = async (req, res) => {
    try {
        // Fetches all transactions where the user is either the buyer or seller
        const history = await Transaction.find({ 
            $or: [{ buyer: req.user.id }, { seller: req.user.id }] 
        }).sort({ createdAt: -1 });
        
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch history", error: error.message });
    }
};