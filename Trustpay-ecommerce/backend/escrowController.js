const mongoose = require('mongoose');

// Define what an Escrow Transaction looks like
const EscrowSchema = new mongoose.Schema({
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING_PAYMENT', 'HELD', 'RELEASED', 'DISPUTED'], 
    default: 'PENDING_PAYMENT' 
  },
  createdAt: { type: Date, default: Date.now }
});

const Escrow = mongoose.model('Escrow', EscrowSchema);

// 1. Create a new escrow hold
const createEscrow = async (req, res) => {
  try {
    const { buyerId, sellerId, amount } = req.body;
    const transaction = new Escrow({ buyerId, sellerId, amount, status: 'HELD' });
    await transaction.save();
    res.status(201).json({ message: "🔒 Funds successfully secured in escrow!", transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Release funds to the seller
const releaseEscrow = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Escrow.findByIdAndUpdate(id, { status: 'RELEASED' }, { new: true });
    res.status(200).json({ message: "💰 Funds successfully released to the seller!", transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createEscrow, releaseEscrow, Escrow };