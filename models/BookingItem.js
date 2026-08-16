import mongoose from 'mongoose';

const bookingItemSchema = new mongoose.Schema({
  business: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessProfile',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'restaurant',
      'hotel',
      'flight',
      'transport',
      'car_rental',
      'vacation_rental',
      'event',
      'appointment',
      'professional_service',
      'other'
    ]
  },
  title: { type: String, required: true, trim: true }, // e.g., "Standard Double Room", "Table for 4", "Lagos to Abuja Flight"
  description: { type: String },
  images: [String],
  pricing: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    unit: { type: String, enum: ['per_night', 'per_person', 'per_hour', 'per_item', 'per_trip', 'fixed'], default: 'fixed' }
  },
  capacity: {
    maxGuests: { type: Number, default: 1 },
    totalUnitsAvailable: { type: Number, default: 1 } // e.g., number of rooms or tables
  },
  // Category-specific attributes
  details: {
    // Restaurant / Appointments
    durationMinutes: Number,
    // Hotel / Vacation Rental
    bedType: String,
    amenities: [String],
    // Transport / Flight
    departureLocation: String,
    arrivalLocation: String,
    departureTime: Date,
    arrivalTime: Date,
    routeNumber: String,
    cabinClass: { type: String, enum: ['economy', 'business', 'first_class', 'standard'], default: 'standard' },
    // Events
    venue: String,
    eventDate: Date
  },
  availabilityRules: {
    isAvailable: { type: Boolean, default: true },
    availableDays: [String],
    slotIntervals: [String] // For appointments/restaurants
  }
}, { timestamps: true });

const BookingItem = mongoose.model('BookingItem', bookingItemSchema);

export default BookingItem;