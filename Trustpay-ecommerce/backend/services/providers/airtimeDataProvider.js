const axios = require('axios');

class AirtimeDataProvider {
  constructor() {
    this.baseUrl = process.env.DIGITAL_PROVIDER_BASE_URL;
    this.apiKey = process.env.DIGITAL_PROVIDER_API_KEY;
  }

  async purchaseAirtime({ network, phoneNumber, amount, reference }) {
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Digital provider credentials not configured.');
    }
    const response = await axios.post(`${this.baseUrl}/airtime/purchase`, {
      network, phone: phoneNumber, amount, reference
    }, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    return response.data;
  }

  async purchaseData({ network, planCode, phoneNumber, reference }) {
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Digital provider credentials not configured.');
    }
    const response = await axios.post(`${this.baseUrl}/data/purchase`, {
      network, plan: planCode, phone: phoneNumber, reference
    }, {
      headers: { Authorization: `Bearer ${this.apiKey}` }
    });
    return response.data;
  }
}

module.exports = new AirtimeDataProvider();