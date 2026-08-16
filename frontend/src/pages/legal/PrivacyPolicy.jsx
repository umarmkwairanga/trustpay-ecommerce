import React from 'react';
import LegalLayout from './LegalLayout';

const PrivacyPolicy = () => {
    return (
        <LegalLayout title="Privacy Policy">
            <p>Effective Date: June 15, 2026</p>
            <h2 className="text-2xl font-semibold mt-4">1. Introduction</h2>
            <p>Welcome to TrustPayEcommerceEcommerce. We are committed to protecting your personal information and your right to privacy...</p>
            
            <h2 className="text-2xl font-semibold mt-4">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as your name, email address, phone number, and KYC documents (NIN/BVN)...</p>
            
            <h2 className="text-2xl font-semibold mt-4">3. How We Use Your Information</h2>
            <p>To process your transactions, manage your escrow account, and comply with legal anti-money laundering (AML) regulations...</p>
            
            {/* Add sections for Data Sharing, Cookies, and User Rights */}
        </LegalLayout>
    );
};

export default PrivacyPolicy;