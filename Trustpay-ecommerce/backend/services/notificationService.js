import twilio from 'twilio';

// Initialize Twilio client
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOrderNotification = async (phoneNumber, orderId, status) => {
  try {
    const message = await client.messages.create({
      body: `TrustPayEcommerce Update: Your order #${orderId} is now ${status}. Thank you for using TrustPayEcommerce!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber 
    });
    console.log(`Notification sent: ${message.sid}`);
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
};