const mongoose = import('mongoose');
const Product = import('./Product');

const serviceSchema = new mongoose.Schema({
  hourlyRate: Number,
  experienceLevel: String, // e.g., 'Junior', 'Senior'
  availability: String,    // e.g., 'Mon-Fri'
  serviceType: String      // e.g., 'Consulting', 'Repair'
});

export default = Product.discriminator('service', serviceSchema);