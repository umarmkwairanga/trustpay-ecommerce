import request from 'supertest';
import app from '../server'; // Import your Express/Node app

describe('Authentication API', () => {
  it('should return 401 for invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
  });
});