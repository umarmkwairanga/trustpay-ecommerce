const request = require('supertest');
const app = require('../server'); // Adjust the path to your main app file

describe('POST /api/webhooks/flutterwave', () => {
  it('should respond with 200 for a valid webhook event', async () => {
    const mockPayload = {
      event: 'charge.completed',
      data: {
        tx_ref: 'TEST_REF_123',
        status: 'successful'
      }
    };
    
    const response = await request(app)
      .post('/api/webhooks/flutterwave')
      .send(mockPayload);
      
    expect(response.statusCode).toBe(200);
  });
});