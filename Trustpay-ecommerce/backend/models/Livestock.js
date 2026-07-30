import mongoose from 'mongoose';

const { Schema } = mongoose;

const LivestockSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A livestock listing must belong to a registered seller.'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a descriptive title for the listing.'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters.'],
    },
    category: {
      type: String,
      default: 'Livestock',
      enum: ['Livestock'],
    },
    subcategory: {
      type: String,
      required: [true, 'Please select a livestock subcategory.'],
      enum: {
        values: [
          'cattle',
          'goats',
          'sheep',
          'poultry',
          'fish',
          'rabbits',
          'horses',
          'swine',
          'other',
        ],
        message: '{VALUE} is not a valid livestock subcategory.',
      },
      lowercase: true,
      index: true,
    },
    breed: {
      type: String,
      required: [true, 'Please specify the animal breed.'],
      trim: true,
      index: true,
    },
    age: {
      value: { type: Number, required: true, min: 0 },
      unit: {
        type: String,
        enum: ['days', 'weeks', 'months', 'years'],
        default: 'months',
      },
    },
    weight: {
      value: { type: Number, required: true, min: 0 },
      unit: {
        type: String,
        enum: ['kg', 'lbs', 'grams'],
        default: 'kg',
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'mixed', 'unsexed'],
      default: 'unsexed',
    },
    quantityAvailable: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1.'],
      default: 1,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please specify the price per unit.'],
      min: [0, 'Price cannot be negative.'],
    },
    currency: {
      type: String,
      default: 'NGN',
      uppercase: true,
    },
    escrowEligible: {
      type: Boolean,
      default: true,
    },
    healthStatus: {
      isVaccinated: { type: Boolean, default: false },
      vaccinationRecordsUrl: { type: String, default: null },
      isVetInspected: { type: Boolean, default: false },
      healthNotes: { type: String, trim: true },
    },
    images: {
      type: [String],
      validate: [
        (val) => val.length > 0,
        'At least one image is required for the livestock listing.',
      ],
    },
    videos: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description.'],
      trim: true,
    },
    isAiGeneratedDescription: {
      type: Boolean,
      default: false,
    },
    location: {
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      address: { type: String, trim: true },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },
    deliveryOptions: {
      sellerDeliveryAvailable: { type: Boolean, default: false },
      buyerPickupAvailable: { type: Boolean, default: true },
      requiresSpecializedTransport: { type: Boolean, default: true },
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'archived'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

LivestockSchema.index({ subcategory: 1, breed: 1, pricePerUnit: 1 });
LivestockSchema.index({ 'location.state': 1, status: 1 });
LivestockSchema.index({ 'location.coordinates': '2dsphere' });
LivestockSchema.index({ title: 'text', description: 'text', breed: 'text' });

const Livestock = mongoose.model('Livestock', LivestockSchema);
export default Livestock;