import('dotenv').config();
const twilio = import('twilio');

// 1. Verify that variables are loaded
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const phone = process.env.TWILIO_PHONE_NUMBER;

if (!sid || !token || !phone) {
    console.error("CRITICAL ERROR: One or more environment variables are missing!");
    console.error(`SID: ${sid ? 'Found' : 'MISSING'}`);
    console.error(`TOKEN: ${token ? 'Found' : 'MISSING'}`);
    console.error(`PHONE: ${phone ? 'Found' : 'MISSING'}`);
    process.exit(1); // Stop the script
}

console.log("Credentials detected. Initializing client...");
const client = new twilio(sid, token);

async function sendTestSMS() {
    try {
        console.log("Attempting to send SMS...");
        const message = await client.messages.create({
            body: 'TrustPay Test: Recovery successful!',
            from: phone,
            to: '+23480XXXXXXXXXX' // REPLACE WITH YOUR VERIFIED NUMBER
        });
        console.log('Success! Message SID:', message.sid);
    } catch (error) {
        console.error('Twilio Error:', error.message);
    }
}

sendTestSMS();