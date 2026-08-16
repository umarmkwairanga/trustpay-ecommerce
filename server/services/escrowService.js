const Escrow = require('../models/Escrow');
const Wallet = require('../models/Wallet');
const Ledger = require('../models/Ledger');
const mongoose = require('mongoose');

class EscrowService {
  async releaseEscrow(escrowId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const escrow = await Escrow.findById(escrowId).session(session);
      if (!escrow) throw new Error('Escrow transaction not found.');
      
      if (escrow.escrowStatus !== 'BUYER_CONFIRMED' && escrow.escrowStatus !== 'DELIVERED_COMPLETED') {
        throw new Error('Escrow cannot be released in its current state.');
      }

      if (escrow.dispute && escrow.dispute.status === 'ACTIVE') {
        throw new Error('Cannot release escrow during an active dispute.');
      }

      escrow.escrowStatus = 'RELEASED';
      await escrow.save({ session });

      // Transfer funds to seller wallet
      const sellerWallet = await Wallet.findOne({ user: escrow.seller }).session(session);
      if (!sellerWallet) throw new Error('Seller wallet not found.');

      sellerWallet.balance += escrow.amount;
      await sellerWallet.save({ session });

      // Create ledger entry
      await Ledger.create([{
        user: escrow.seller,
        type: 'CREDIT',
        amount: escrow.amount,
        reference: escrow.transactionReference,
        description: `Escrow released for order/booking ${escrow._id}`
      }], { session });

      await session.commitTransaction();
      session.endSession();
      return escrow;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}

module.exports = new EscrowService();