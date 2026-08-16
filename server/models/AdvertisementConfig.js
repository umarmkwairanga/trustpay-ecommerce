const mongoose = require('mongoose');

const advertisementConfigSchema = new mongoose.Schema({
    adTypes: {
        featured_product: { pricePerDay: { type: Number, default: 5.00 } },
        featured_store: { pricePerDay: { type: Number, default: 10.00 } },
        homepage_banner: { pricePerDay: { type: Number, default: 25.00 } },
        category_ad: { pricePerDay: { type: Number, default: 8.00 } },
        search_sponsored: { pricePerDay: { type: Number, default: 6.00 } },
        promotional_campaign: { pricePerDay: { type: Number, default: 15.00 } },
        service_ad: { pricePerDay: { type: Number, default: 7.00 } },
        vehicle_ad: { pricePerDay: { type: Number, default: 12.00 } },
        real_estate_ad: { pricePerDay: { type: Number, default: 20.00 } },
        other_listing: { pricePerDay: { type: Number, default: 5.00 } }
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('AdvertisementConfig', advertisementConfigSchema);