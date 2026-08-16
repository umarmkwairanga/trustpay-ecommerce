const Advertisement = require('../models/Advertisement');

const checkAndExpireAds = async () => {
    try {
        const now = new Date();
        await Advertisement.updateMany(
            { status: { $in: ['Active', 'Approved'] }, endDate: { $lt: now } },
            { $set: { status: 'Expired' } }
        );
        // Also auto-activate approved ads whose start date has arrived
        await Advertisement.updateMany(
            { status: 'Approved', startDate: { $lte: now }, endDate: { $gte: now } },
            { $set: { status: 'Active' } }
        );
    } catch (error) {
        console.error('Error running ad expiration worker:', error);
    }
};

setInterval(checkAndExpireAds, 60 * 60 * 1000); // Check every hour
module.exports = checkAndExpireAds;