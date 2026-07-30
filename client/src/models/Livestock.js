// models/Livestock.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LivestockSchema = new Schema(
  {
    // Link to Seller/User
    seller: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'A livestock listing must belong to a registered seller.'],
      index: true,
    },

    // Title & General Categorization
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

    // Physical Characteristics
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

    // Pricing & Escrow
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

    // Health & Verification
    healthStatus: {
      isVaccinated: { type: Boolean, default: false },
      vaccinationRecordsUrl: { type: String, default: null },
      isVetInspected: { type: Boolean, default: false },
      healthNotes: { type: String, trim: true },
    },

    // Media Handling (Supports both image and video showcase)
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

    // Descriptions & AI Metadata
    description: {
      type: String,
      required: [true, 'Please provide a detailed description.'],
      trim: true,
    },
    isAiGeneratedDescription: {
      type: Boolean,
      default: false,
    },

    // Location & Geospatial Indexing for nearby search
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
        // [longitude, latitude]
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
      },
    },

    // Transport & Delivery Preferences
    deliveryOptions: {
      sellerDeliveryAvailable: { type: Boolean, default: false },
      buyerPickupAvailable: { type: Boolean, default: true },
      requiresSpecializedTransport: { type: Boolean, default: true },
    },

    // Listing Status
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold', 'archived'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true, // Auto-generates createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for high-performance filtering
LivestockSchema.index({ subcategory: 1, breed: 1, pricePerUnit: 1 });
LivestockSchema.index({ 'location.state': 1, status: 1 });
LivestockSchema.index({ 'location.coordinates': '2dsphere' }); // Enable geospatial proximity search

// Text Index for full-text keyword searches
LivestockSchema.index({ title: 'text', description: 'text', breed: 'text' });

module.exports = mongoose.model('Livestock', LivestockSchema);