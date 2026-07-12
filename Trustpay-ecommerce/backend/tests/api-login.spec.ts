import request from 'supertest';
import { expect } from 'expect';
// Import your app instance (e.g., const app = require('../app');)
import app from '../server'; 

describe('POST /api/login', () => {
  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@test.com', password: 'badpassword' });

    expect(res.status).toBe(401);
  });
});