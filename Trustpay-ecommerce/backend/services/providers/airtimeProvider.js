const axios = require('axios');

class AirtimeProvider {
  constructor() {
    this.baseUrl = process.env.DIGITAL_PROVIDER_BASE_URL;
    this.apiKey = process.env.DIGITAL_PROVIDER_API_KEY;
  }

  async getProviders() {
    if (!this.apiKey) throw new Error('Digital provider API key not configured.');
    return [{ id: 'MTN', name: 'MTN Nigeria' }, { id: 'GLO', name: 'Glo Nigeria' }, { id: 'AIRTEL', name: 'Airtel Nigeria' }, { id: '9MOBILE', name: '9mobile' }];
  }

  async purchase({ network, phoneNumber, amount, reference }) {
    if (!this.apiKey || !this.baseUrl) {
      throw new Error('Digital provider credentials missing.');
    }
    const response = await axios.post(`${this.baseUrl}/airtime/purchase`, {
      network, phone: phoneNumber, amount, reference
    }, { headers: { Authorization: `Bearer ${this.apiKey}` } });
    return response.data;
  }
}

module.exports = new AirtimeProvider();