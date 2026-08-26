const DigitalTransaction = require('../../models/DigitalTransaction');
const { InsuranceProduct } = require('../../models/InsurancePolicy');

class AIToolbox {
  async getUserTransactions(userId, limit = 5) {
    return await DigitalTransaction.find({ user: userId }).sort({ createdAt: -1 }).limit(limit);
  }

  async getInsuranceProducts() {
    return await InsuranceProduct.find({});
  }

  async getDigitalAnalytics() {
    const totalTx = await DigitalTransaction.countDocuments();
    const successfulTx = await DigitalTransaction.countDocuments({ status: 'SUCCESS' });
    const failedTx = await DigitalTransaction.countDocuments({ status: 'FAILED' });
    const revenueAgg = await DigitalTransaction.aggregate([
      { $match: { status: 'SUCCESS' } },
      { $group: { _id: '$serviceType', total: { $sum: '$totalAmount' } } }
    ]);
    return { totalTx, successfulTx, failedTx, revenueByService: revenueAgg };
  }
}

module.exports = new AIToolbox();