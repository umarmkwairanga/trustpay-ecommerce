import React from 'react';
import LegalLayout from './LegalLayout';

const BuyerProtection = () => {
    return (
        <LegalLayout title="Buyer Protection Policy">
            <h2 className="text-2xl font-semibold mt-4">1. Scope of Coverage</h2>
            <p>TrustPayEcommerce’s Buyer Protection ensures that your funds are held securely until the transaction is successfully completed. You are protected if the item you receive is significantly different from its description or if it fails to arrive.</p>

            <h2 className="text-2xl font-semibold mt-4">2. Eligibility</h2>
            <p>To be eligible for protection, the transaction must have been processed entirely through the TrustPayEcommerce Escrow system.</p>

            <h2 className="text-2xl font-semibold mt-4">3. Dispute Process</h2>
            <p>If you encounter an issue, you must file a dispute through your Order History within 48 hours of marked delivery. TrustPayEcommerce will freeze the funds and conduct a formal investigation to resolve the issue fairly.</p>

            <h2 className="text-2xl font-semibold mt-4">4. Non-Covered Items</h2>
            <p>Certain items, such as prohibited goods or services not directly related to the marketplace, are not covered under this policy[cite: 1].</p>
        </LegalLayout>
    );
};

export default BuyerProtection;