import React, { useState } from 'react';
import { FlutterwaveButton } from 'react-paystack';
import api from '../services/api';

const CheckoutPage = ({ totalAmount, email, items }) => {
    const publicKey = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY; 
    const [status, setStatus] = useState('');

    const componentProps = {
        email,
        amount: Math.round(totalAmount * 100), // Convert to Kobo
        publicKey,
        text: "Pay Now ₦" + totalAmount.toLocaleString(),
        onSuccess: async (res) => {
            try {
                await api.post('/orders', { 
                    totalAmount, 
                    items, 
                    reference: res.reference 
                });
                setStatus("Payment verified and order placed!");
            } catch (err) {
                setStatus("Payment successful, but failed to save order to database.");
            }
        },
        onClose: () => setStatus("Transaction cancelled."),
    };

    return (
        // Applied 'card' class for the professional TrustPayEcommerceEcommerceEcommerce look
        <div className="card">
            <h3 className="text-xl font-bold mb-2" style={{ color: '#001F5B' }}>Checkout</h3>
            <p className="mb-4 text-sm text-gray-600">Secure payment via TrustPayEcommerceEcommerceEcommerce</p>
            <p className="mb-4">Total Amount: <strong>₦{totalAmount.toLocaleString()}</strong></p>
            
            {/* Using btn-primary for Orange CTA branding */}
            <FlutterwaveButton 
                {...componentProps} 
                className="btn-primary w-full" 
            />
            
            {status && (
                <p className="mt-4 text-sm font-semibold" style={{ color: status.includes('failed') ? '#EF4444' : '#22C55E' }}>
                    {status}
                </p>
            )}
        </div>
    );
};

export default CheckoutPage;