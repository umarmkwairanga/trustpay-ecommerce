import nodemailer from 'nodemailer';

// Configure your email transporter
// If using Gmail, you may need an 'App Password'
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Add these to your .env file
        pass: process.env.EMAIL_PASS
    }
});

export const sendPaymentNotification = async (sellerEmail, orderId, amount) => {
    try {
        const mailOptions = {
            from: '"TrustPay Escrow" <no-reply@trustpay.com>',
            to: sellerEmail,
            subject: 'Funds Secured: Escrow Payment Received',
            text: `Hello, your funds of ${amount} for Order #${orderId} have been securely held in escrow. You can now proceed with the delivery.`,
            html: `<p>Hello,</p>
                   <p>Great news! Your funds of <strong>${amount}</strong> for Order <strong>#${orderId}</strong> have been securely held in escrow.</p>
                   <p>You can now proceed with the delivery of your product.</p>
                   <p>Best regards,<br>TrustPay Team</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${sellerEmail}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};