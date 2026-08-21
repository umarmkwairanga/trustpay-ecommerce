import fetch from 'node-fetch'; // If using Node 18+, global fetch is built-in. If not, use standard fetch or axios.

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('🚀 Starting TrustPayEcommerce Automated Endpoint Test...\n');

  try {
    // 1. Register a Flight Provider
    const email = `provider_${Date.now()}@test.com`;
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'TestFlightProvider',
        email,
        password: 'Password123!',
        role: 'flight_provider'
      })
    });
    const regData = await regRes.json();
    console.log('1. Register Provider:', regRes.status === 201 || regRes.status === 200 ? '✅ SUCCESS' : 'ℹ️ NOTE', regData.message || regData);

    // Note: To test authenticated routes (listing creation, admin approval), 
    // obtain a token via your login endpoint and assign it here:
    const token = 'YOUR_BEARER_TOKEN_HERE'; 

    // 2. Test Public Marketplace Discovery across verticals
    const verticals = ['flight', 'hotel', 'restaurant', 'vehicle', 'realestate', 'service'];
    for (const v of verticals) {
      const marketRes = await fetch(`${BASE_URL}/providers/marketplace/${v}`);
      const marketData = await marketRes.json();
      console.log(`Marketplace Discovery [${v}]:`, marketRes.ok ? `✅ SUCCESS (${marketData.length} listings found)` : '❌ FAILED');
    }

    // 3. Test Approved Categories
    const catRes = await fetch(`${BASE_URL}/categories/approved`);
    const catData = await catRes.json();
    console.log('Approved Categories Fetch:', catRes.ok ? `✅ SUCCESS (${catData.length} categories)` : '❌ FAILED');

    console.log('\n✨ Automated verification check completed!');
  } catch (error) {
    console.error('Test execution error (Ensure your server is running):', error.message);
  }
}

runTests();