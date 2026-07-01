const Wallet = import('../models/Wallet');
const Withdrawal = import('../models/Withdrawal');

exports.requestWithdrawal = async (req, res) => {
  const { amount, bankName, accountNumber } = req.body;
  const userId = req.user.id;

  try {
    const wallet = await Wallet.findOne({ userId });

    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // 1. Deduct balance immediately (Hold state)
    wallet.balance -= amount;
    await wallet.save();

    // 2. Create the withdrawal request
    const request = await Withdrawal.create({
      userId, amount, bankName, accountNumber
    });

    res.status(201).json({ message: "Withdrawal request submitted", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};