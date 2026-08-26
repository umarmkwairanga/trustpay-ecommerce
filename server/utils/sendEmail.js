import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to, subject, text) => {
    try {
        const info = await transporter.sendMail({
            from: '"TrustPayEcommerce Support" <support@TrustPayEcommerce.com>',
            to,
            subject,
            text
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        // Depending on your needs, you might want to throw the error
        // or return a failure status to be handled by the controller
        return { success: false, error: error.message };
    }
};