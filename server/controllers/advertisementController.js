const Advertisement = require('../models/Advertisement');
const AdvertisementConfig = require('../models/AdvertisementConfig');
const AdvertisementTransaction = require('../models/AdvertisementTransaction');
const Product = require('../models/Product');
const Seller = require('../models/Seller');
const adModerationService = require('../services/adModerationService');

// Calculate Pricing & Create Campaign Draft
exports.createCampaign = async (req, res) => {
    try {
        const { title, description, adType, targetModel, targetReference, bannerUrl, destinationUrl, targetCategory, startDate, endDate } = req.body;
        
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) return res.status(403).json({ success: false, message: 'Access denied. Seller account required.' });

        // Security check: Verify item ownership if targeting products/listings
        if (targetModel === 'Product') {
            const product = await Product.findById(targetReference);
            if (!product || product.seller.toString() !== seller._id.toString()) {
                return res.status(403).json({ success: false, message: 'Unauthorized: You can only advertise your own products.' });
            }
        }

        const start = new Date(startDate);
        const end = new Date(endDate);
        const durationDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
        if (durationDays <= 0) return res.status(400).json({ success: false, message: 'Invalid campaign duration.' });

        let config = await AdvertisementConfig.findOne();
        if (!config) config = await AdvertisementConfig.create({});

        const dailyRate = config.adTypes[adType]?.pricePerDay || 5.00;
        const totalPrice = dailyRate * durationDays;

        const ad = await Advertisement.create({
            seller: seller._id,
            title,
            description,
            adType,
            targetModel,
            targetReference,
            bannerUrl,
            destinationUrl,
            targetCategory,
            startDate: start,
            endDate: end,
            durationDays,
            totalPrice,
            status: 'Draft'
        });

        res.status(201).json({ success: true, data: ad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit Advertisement for Approval after Payment Verification Simulation / Webhook
exports.submitCampaignPaymentWebhook = async (req, res) => {
    try {
        const { adId, paymentReference, gatewayResponse } = req.body;
        const ad = await Advertisement.findById(adId);
        if (!ad) return res.status(404).json({ success: false, message: 'Advertisement not found.' });

        // Record separate advertisement transaction (Strictly NOT escrow)
        const txn = await AdvertisementTransaction.create({
            advertisement: ad._id,
            seller: ad.seller,
            amount: ad.totalPrice,
            paymentGatewayReference: paymentReference,
            paymentStatus: 'Success',
            gatewayResponse
        });

        ad.status = 'Pending Approval';
        ad.paymentReference = paymentReference;

        // Run AI Safety Check Layer
        const moderation = await adModerationService.runAIModerationCheck(ad);
        ad.aiSafetyScore = moderation.score;
        ad.aiFlags = moderation.flags;

        await ad.save();

        res.status(200).json({ success: true, message: 'Payment verified and campaign submitted for review.', data: ad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Seller Campaign Actions: Pause / Cancel / View
exports.getSellerCampaigns = async (req, res) => {
    try {
        const seller = await Seller.findOne({ user: req.user._id });
        if (!seller) return res.status(403).json({ success: false, message: 'Seller profile not found.' });

        const campaigns = await Advertisement.find({ seller: seller._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: campaigns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.pauseCampaign = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        const seller = await Seller.findOne({ user: req.user._id });

        if (!ad || ad.seller.toString() !== seller._id.toString()) {
            return res.status(403).json({ success: false, message: 'Unauthorized action.' });
        }

        if (ad.status !== 'Active') return res.status(400).json({ success: false, message: 'Only active campaigns can be paused.' });

        ad.status = 'Paused';
        await ad.save();
        res.status(200).json({ success: true, message: 'Campaign paused successfully.', data: ad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};