// 1. Load keys from your root folder
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

// 2. Import service
import { sendSMS } from './services/twilioService.js';

const runFinalTest = async () => {
    console.log('==================================================');
    console.log('🔍 CREDENTIAL DEBUGGER & SCRIPT RUNNER');
    console.log('==================================================');
    
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const phone = process.env.TWILIO_PHONE_NUMBER;

    console.log('Environment Diagnostics:');
    console.log(`- TWILIO_ACCOUNT_SID: ${sid ? `Found (Starts with: "${sid.substring(0, 4)}...", Total Length: ${sid.length})` : '❌ NOT FOUND'}`);
    console.log(`- TWILIO_AUTH_TOKEN:  ${token ? `Found (Starts with: "${token.substring(0, 3)}...", Total Length: ${token.length})` : '❌ NOT FOUND'}`);
    console.log(`- TWILIO_PHONE_NUMBER: ${phone ? `Found ("${phone}")` : '❌ NOT FOUND'}\n`);

    const targetPhoneNumber = '+2349033489644'; 
    
    // FORCE MOCK MODE FOR LOCAL TESTING OVERRIDE
    const FORCE_MOCK = true; 

    if (FORCE_MOCK) {
        console.log(`👉 [FORCED MOCK ACTIVE] Simulating test to: ${targetPhoneNumber}...`);
        console.log('\n--- 🛠️ [MOCK SMS DISPATCH] ---');
        console.log(`TO:      ${targetPhoneNumber}`);
        console.log(`BODY:    TrustPayEcommerce: Connection verified! 🎉`);
        console.log('-------------------------------\n');
        console.log(`✅ SUCCESS! Message intercepted locally. ID: MOCK_ID_${Date.now()}`);
    } else {
        console.log(`👉 Dispatching live test to: ${targetPhoneNumber}...`);
        try {
            const result = await sendSMS(targetPhoneNumber, 'TrustPayEcommerce: Connection verified! 🎉');
            if (result.success) {
                console.log(`\n✅ SUCCESS! Message sent via Twilio. ID: ${result.messageId}`);
            } else {
                console.error(`\n❌ TWILIO ERROR: ${result.error}`);
            }
        } catch (fatalError) {
            console.error(`\n❌ CRITICAL EXCEPTION:`, fatalError.message);
        }
    }
    console.log('==================================================');
};

runFinalTest();