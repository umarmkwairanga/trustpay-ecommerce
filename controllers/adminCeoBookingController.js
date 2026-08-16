import BookingTransaction from '../models/BookingTransaction.js';
import BusinessProfile from '../models/BusinessProfile.js';
import BookingItem from '../models/BookingItem.js';

// @desc    Get all booking providers for Admin review / verification
// @route   GET /api/admin/business-providers
// @access  Private (Admin / CEO)
export const getAdminProviders = async (req, res) => {
    try {
        const providers = await BusinessProfile.find({})
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: providers.length,
            providers
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Admin approve or reject a business provider profile
// @route   PATCH /api/admin/business-providers/:id/status
// @access  Private (Admin / CEO)
export const updateProviderVerificationStatus = async (req, res) => {
    try {
        const { verificationStatus } = req.body; // 'verified', 'rejected', 'suspended'
        const validStatuses = ['pending', 'verified', 'rejected', 'suspended'];

        if (!validStatuses.includes(verificationStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid verification status.' });
        }

        const provider = await BusinessProfile.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({ success: false, message: 'Business profile not found.' });
        }

        provider.verificationStatus = verificationStatus;
        await provider.save();

        res.status(200).json({
            success: true,
            message: `Provider verification status updated to ${verificationStatus}`,
            provider
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get CEO booking metrics, GMV, platform revenue, and category breakdowns
// @route   GET /api/ceo/booking-kpis
// @access  Private (CEO / Admin)
export const getCeoBookingKPIs = async (req, res) => {
    try {
        const totalBookings = await BookingTransaction.countDocuments();
        const activeProviders = await BusinessProfile.countDocuments({ verificationStatus: 'verified' });
        
        // Aggregate Gross Merchandise Value (GMV) and TrustPay platform fee revenue from completed/confirmed bookings
        const revenueAggregation = await BookingTransaction.aggregate([
            { $match: { paymentStatus: 'success' } },
            { 
                $group: { 
                    _id: null, 
                    totalGMV: { $sum: '$pricingDetails.totalAmount' }, 
                    totalPlatformRevenue: { $sum: '$pricingDetails.platformFee' } 
                } 
            }
        ]);

        const bookingsByStatus = await BookingTransaction.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const categoryBreakdown = await BookingItem.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            kpis: {
                totalBookings,
                activeProviders,
                totalGMV: revenueAggregation[0]?.totalGMV || 0,
                platformRevenue: revenueAggregation[0]?.totalPlatformRevenue || 0,
                bookingsByStatus,
                categoryBreakdown
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};