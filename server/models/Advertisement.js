const mongoose = require('mongoose');

const advertisementSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    adType: {
        type: String,
        enum: [
            'featured_product', 'featured_store', 'homepage_banner', 
            'category_ad', 'search_sponsored', 'promotional_campaign', 
            'service_ad', 'vehicle_ad', 'real_estate_ad', 'other_listing'
        ],
        required: true
    },
    targetModel: { type: String, enum: ['Product', 'Store', 'Listing', 'Service', 'Vehicle', 'RealEstate'], required: true },
    targetReference: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel', required: true },
    bannerUrl: { type: String, required: true },
    destinationUrl: { type: String, required: true },
    targetCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    durationDays: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: [
            'Draft', 'Pending Payment', 'Payment Processing', 'Paid', 
            'Pending Approval', 'Approved', 'Active', 'Paused', 
            'Rejected', 'Expired', 'Cancelled'
        ],
        default: 'Draft'
    },
    rejectionReason: { type: String, default: '' },
    paymentReference: { type: String, default: '' },
    analytics: {
        impressions: { type: Number, default: 0 },
        clicks: { type: Number, default: 0 },
        spend: { type: Number, default: 0 }
    },
    aiSafetyScore: { type: Number, default: 100 },
    aiFlags: [{ type: String }]
}, { timestamps: true });

advertisementSchema.index({ status: 1, startDate: 1, endDate: 1 });
advertisementSchema.index({ seller: 1 });

module.exports = mongoose.model('Advertisement', advertisementSchema);