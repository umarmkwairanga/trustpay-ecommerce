import React from 'react';
import LegalLayout from './LegalLayout';

const SellerProtection = () => {
    return (
        <LegalLayout title="Seller Protection Policy">
            <h2 className="text-2xl font-semibold mt-4">1. Payment Security</h2>
            <p>TrustPayEcommerce guarantees that payments for legitimate transactions are secured in our escrow account before you are instructed to ship the product.</p>

            <h2 className="text-2xl font-semibold mt-4">2. Protection Against Chargebacks</h2>
            <p>If a buyer initiates a fraudulent chargeback after a successful delivery, TrustPayEcommerce will utilize the provided proof of shipment and delivery confirmation to represent the transaction and defend the seller[cite: 1].</p>

            <h2 className="text-2xl font-semibold mt-4">3. Dispute Fairness</h2>
            <p>Sellers are entitled to a fair review process. If a dispute is raised, TrustPayEcommerce imports evidence of item condition and shipment from the seller to ensure a neutral, evidence-based resolution[cite: 1].</p>

            <h2 className="text-2xl font-semibold mt-4">4. Seller Obligations</h2>
            <p>To qualify for protection, sellers must provide accurate product descriptions, utilize our recommended shipping methods, and upload valid tracking information within the platform[cite: 1].</p>
        </LegalLayout>
    );
};

export default SellerProtection;