import mongoose from 'mongoose';
const businessProfileSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
export default mongoose.models.BusinessProfile || mongoose.model('BusinessProfile', businessProfileSchema);