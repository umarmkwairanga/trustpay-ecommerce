const Transaction = import('../models/Transaction');

exports.createTransaction = async (req, res) => {
    try {
        const newTransaction = new Transaction(req.body);
        await newTransaction.save();
        res.status(201).json({ message: "Transaction created", transaction: newTransaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};