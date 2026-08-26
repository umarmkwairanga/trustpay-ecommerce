// templates/emailTemplates.js

const emailStyle = `
    font-family: 'Segoe UI', Arial, sans-serif; 
    line-height: 1.6; 
    color: #041B4D; 
    max-width: 600px; 
    margin: 0 auto;
    border: 1px solid #e0e0e0;
    padding: 20px;
    border-radius: 8px;
`;

const buttonStyle = `
    display: inline-block; 
    background-color: #FF7A00; 
    color: #ffffff; 
    padding: 10px 20px; 
    text-decoration: none; 
    border-radius: 5px; 
    font-weight: bold;
`;

export const getCompletionEmail = (orderId) => ({
    subject: "TrustPayEcommerceEcommerce: Transaction Successfully Completed",
    html: `
        <div style="${emailStyle}">
            <h1 style="color: #041B4D;">TrustPayEcommerceEcommerce</h1>
            <h2 style="color: #FF7A00;">Transaction Completed</h2>
            <p>Your transaction <strong>${orderId}</strong> has been successfully completed.</p>
            <p>Your funds have been securely released to the seller. Thank you for choosing TrustPayEcommerceEcommerce for your secure marketplace transactions.</p>
            <br>
            <a href="https://TrustPayEcommerceEcommerce.com/orders/${orderId}" style="${buttonStyle}">View Order Details</a>
            <p style="margin-top: 30px; font-size: 12px; color: #777;">Securely powered by TrustPayEcommerceEcommerce.</p>
        </div>
    `
});

export const getSecurityAlertEmail = (reason) => ({
    subject: "TrustPayEcommerceEcommerce: Security Update Regarding Your Account",
    html: `
        <div style="${emailStyle}">
            <h1 style="color: #041B4D;">TrustPayEcommerceEcommerce</h1>
            <h2 style="color: #EF4444;">Security Alert</h2>
            <p><strong>Notice:</strong> ${reason}</p>
            <p>If this was not you, please contact our support team immediately to secure your account.</p>
            <br>
            <a href="https://TrustPayEcommerceEcommerce.com/support" style="${buttonStyle}">Contact Support</a>
        </div>
    `
});