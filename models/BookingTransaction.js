import mongoose from 'mongoose';
const bookingTransactionSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
export default mongoose.models.BookingTransaction || mongoose.model('BookingTransaction', bookingTransactionSchema);