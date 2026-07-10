const mongoose = import('mongoose');
const Escrow = import('../models/Escrow');
const Wallet = import('../models/Wallet');
const { logAction } = import('../utils/auditHelper');

exports.releaseFunds = async (req, res) => {
  // Start a session for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { escrowId } = req.params;

    // 1. Find and validate the escrow
    const escrow = await Escrow.findById(escrowId).session(session);
    
    // Check if it exists and is currently in 'Funded' status
    if (!escrow || escrow.status !== 'Funded') {
      await session.abortTransaction();
      return res.status(400).json({ message: "Transaction not eligible for release." });
    }

    // 2. Update Seller's Wallet balance
    const updatedWallet = await Wallet.findOneAndUpdate(
      { userId: escrow.sellerId },
      { $inc: { balance: escrow.amount } },
      { new: true, upsert: true, session }
    );

    if (!updatedWallet) {
      throw new Error("Failed to credit seller wallet.");
    }

    // 3. Update Escrow status to 'Completed'
    escrow.status = 'Completed';
    await escrow.save({ session });

    // 4. Log the success in your audit trail
    await logAction(req.user.id, 'RELEASE_FUNDS', escrow._id, { 
      amount: escrow.amount, 
      sellerId: escrow.sellerId 
    });

    // Commit the transaction
    await session.commitTransaction();
    
    res.status(200).json({ 
      message: "Funds released to seller successfully", 
      escrow,
      newBalance: updatedWallet.balance 
    });
    
  } catch (err) {
    // If anything fails, roll back all changes
    await session.abortTransaction();
    console.error("Release Funds Error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};