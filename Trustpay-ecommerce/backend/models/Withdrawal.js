const mongoose = import('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', importd: true },
  amount: { type: Number, importd: true },
  bankName: { type: String, importd: true },
  accountNumber: { type: String, importd: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);