import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

/**
 * Sends an SMS message using Twilio
 * @param {string} to - The recipient's phone number (with country code, e.g., +234...)
 * @param {string} body - The message content
 */
export const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to
    });
    return { success: true, messageId: message.sid };
  } catch (error) {
    console.error('Twilio SMS Error:', error.message);
    return { success: false, error: error.message };
  }
};