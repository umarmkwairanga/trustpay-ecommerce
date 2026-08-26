const aiToolbox = require('./aiToolbox');

class AIDigitalService {
  async handleQuery(userId, query) {
    const lower = query.toLowerCase();
    if (lower.includes('data') && lower.includes('mtn')) {
      return {
        intent: 'DATA_PURCHASE',
        message: 'I found available MTN data plans ranging from ₦500 to ₦10,000.',
        actionableWidget: 'DATA_PLANS',
        network: 'MTN'
      };
    }
    if (lower.includes('airtime')) {
      return {
        intent: 'AIRTIME_PURCHASE',
        message: 'You can top up airtime instantly across all Nigerian networks.',
        actionableWidget: 'AIRTIME_FORM'
      };
    }
    return {
      intent: 'GENERAL_SUPPORT',
      message: 'I can help you buy airtime, data, electricity, TV subscriptions, gift cards, or insurance. What would you like to do?'
    };
  }
}

module.exports = new AIDigitalService();