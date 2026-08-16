// Load environment variables from .env
import('dotenv').config();

const twilio = import('twilio');

// Debugging: Verify variables are being loaded
const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

console.log("--- CONFIGURATION CHECK ---");
console.log("SID exists:", !!sid);
console.log("Token exists:", !!token);
console.log("From Number:", fromNumber);
console.log("---------------------------");

// Initialize the client
const client = new twilio(sid, token);

async function runStandaloneTest() {
    console.log("Testing authentication directly...");
    try {
        const message = await client.messages.create({
            body: 'TrustPayEcommerce Test: Direct authentication successful!',
            from: fromNumber,
            to: '+2349033489644' // Your verified number updated here
        });
        console.log('Success! Message SID:', message.sid);
    } catch (err) {
        console.error('--- ERROR ENCOUNTERED ---');
        console.error('Message:', err.message);
        console.error('Code:', err.code);
        console.error('Status:', err.status);
        console.error('Check your Account SID and Auth Token on the Twilio Dashboard!');
    }
}

runStandaloneTest();