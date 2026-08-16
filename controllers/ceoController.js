const BookingTransaction = require('../models/BookingTransaction');
const BusinessProfile = require('../models/BusinessProfile');

exports.getBookingKPIs = async (req, res) => {
  try {
    const totalBookings = await BookingTransaction.countDocuments();
    const activeProviders = await BusinessProfile.countDocuments({ verificationStatus: 'verified' });
    
    const aggregatedRevenue = await BookingTransaction.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalGMV: { $sum: '$pricingDetails.totalAmount' }, totalRevenue: { $sum: '$pricingDetails.platformFee' } } }
    ]);

    const categoryBreakdown = await BookingItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      kpis: {
        totalBookings,
        activeProviders,
        totalGMV: aggregatedRevenue[0]?.totalGMV || 0,
        platformRevenue: aggregatedRevenue[0]?.totalRevenue || 0,
        categoryBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};