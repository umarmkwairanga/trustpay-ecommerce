const Advertisement = require('../models/Advertisement');
const AdvertisementConfig = require('../models/AdvertisementConfig');

exports.getAllAdvertisements = async (req, res) => {
    try {
        const { status, adType, search } = req.query;
        let query = {};
        if (status) query.status = status;
        if (adType) query.adType = adType;
        if (search) query.title = { $regex: search, $options: 'i' };

        const ads = await Advertisement.find(query).populate('seller', 'storeName businessName').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: ads.length, data: ads });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveAdvertisement = async (req, res) => {
    try {
        const ad = await Advertisement.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, message: 'Advertisement not found.' });

        ad.status = new Date() >= new Date(ad.startDate) ? 'Active' : 'Approved';
        await ad.save();
        res.status(200).json({ success: true, message: 'Advertisement approved successfully.', data: ad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectAdvertisement = async (req, res) => {
    try {
        const { reason } = req.body;
        if (!reason) return res.status(400).json({ success: false, message: 'Rejection reason is required.' });

        const ad = await Advertisement.findById(req.params.id);
        if (!ad) return res.status(404).json({ success: false, message: 'Advertisement not found.' });

        ad.status = 'Rejected';
        ad.rejectionReason = reason;
        await ad.save();
        res.status(200).json({ success: true, message: 'Advertisement rejected.', data: ad });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updatePricingConfig = async (req, res) => {
    try {
        const { adTypes } = req.body;
        let config = await AdvertisementConfig.findOne();
        if (!config) {
            config = new AdvertisementConfig({ adTypes, updatedBy: req.user._id });
        } else {
            config.adTypes = adTypes;
            config.updatedBy = req.user._id;
        }
        await config.save();
        res.status(200).json({ success: true, message: 'Pricing configuration updated successfully.', data: config });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};