import Product from './Product.js';
import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  mileage: { type: Number },
  fuelType: { type: String }
});

const Vehicle = Product.discriminator('vehicle', vehicleSchema);
export default Vehicle;