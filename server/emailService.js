const nodemailer = import('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your SMTP provider (e.g., SendGrid, Mailgun)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPaymentNotification = async (sellerEmail, tx_ref) => {
    await transporter.sendMail({
        from: '"TrustPayEcommerce" <noreply@TrustPayEcommerce.com>',
        to: sellerEmail,
        subject: 'Payment Received!',
        text: `Great news! Payment for transaction ${tx_ref} has been funded and is now in Escrow.`
    });
};

export default = { sendPaymentNotification };