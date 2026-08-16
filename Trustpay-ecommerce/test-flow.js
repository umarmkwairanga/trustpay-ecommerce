import dotenv from 'dotenv';
import { sendSMS } from './services/twilioService.js';

// Load variables from your .env file
dotenv.config();

const runCompletedTest = async () => {
    console.log('==================================================');
    console.log('🚀 TESTING REAL TWILIO DELIVERY FROM THE BACKEND');
    console.log('==================================================');
    
    const targetPhoneNumber = '+2349033489644'; 
    const testMessage = 'TrustPayEcommerce: Your backend testing script is working perfectly! 🎉';

    console.log(`Sending to: ${targetPhoneNumber}...`);
    
    const result = await sendSMS(targetPhoneNumber, testMessage);
    
    if (result.success) {
        console.log(`✅ SUCCESS! Message sent via Twilio. ID: ${result.messageId}`);
    } else {
        console.error(`❌ FAILED: ${result.error}`);
    }
    console.log('==================================================');
};

runCompletedTest();