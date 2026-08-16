import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or your SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendTransactionEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: '"TrustPayEcommerceEcommerceEcommerce Escrow" <no-reply@TrustPayEcommerceEcommerceecommerce.com>',
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error("Email Error:", error);
    }
};