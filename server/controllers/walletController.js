import Wallet from '../models/Wallet.js';
import { logAdminAction } from '../utils/audit.js';

export const depositFunds = async (userId, amount, description) => {
    // Find or create wallet for the user
    let wallet = await Wallet.findOne({ user: userId });
    
    if (!wallet) {
        wallet = await Wallet.create({ user: userId, balance: 0 });
    }

    // Perform the update
    wallet.balance += amount;
    wallet.transactionHistory.push({
        type: 'credit',
        amount,
        description
    });
    
    await wallet.save();
    return wallet;
};

export const transferFromEscrow = async (req, res) => {
    const { userId, amount, escrowId } = req.body;
    
    try {
        // 1. Move money to user wallet
        await depositFunds(userId, amount, `Escrow Release for Order: ${escrowId}`);
        
        // 2. Audit the action for the CEO
        await logAdminAction(req.user.id, "RELEASED_ESCROW_FUNDS", "Escrow", escrowId, { amount, recipient: userId });
        
        res.status(200).json({ message: "Funds transferred to wallet successfully" });
    } catch (error) {
        res.status(500).json({ message: "Transaction failed", error: error.message });
    }
};