const twilio = import('twilio');

// Initialize Twilio client
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOrderNotification = async (phoneNumber, orderId, status) => {
  try {
    const message = await client.messages.create({
      body: `TrustPay Update: Your order #${orderId} is now ${status}. Thank you for using TrustPay!`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber // Ensure this is in E.164 format (e.g., +234...)
    });
    console.log(`Notification sent: ${message.sid}`);
  } catch (error) {
    console.error('Failed to send SMS:', error);
  }
};

module.exports = { sendOrderNotification };