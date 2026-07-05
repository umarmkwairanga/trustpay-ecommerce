// emailService.js
import nodemailer from 'nodemailer';

// Configure the transport using environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendTransactionEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: '"TrustPayEcommerce Escrow" <no-reply@TrustPayEcommerce.com>',
            to,
            subject,
            text,
        });
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Email Service Error:", error);
    }
};