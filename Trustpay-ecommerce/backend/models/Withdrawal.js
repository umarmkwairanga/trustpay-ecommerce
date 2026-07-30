const mongoose = import('mongoose');

const WithdrawalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  bankName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default = mongoose.model('Withdrawal', WithdrawalSchema);