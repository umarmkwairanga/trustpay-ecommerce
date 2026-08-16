import React from "react";
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const FlutterwaveButton = ({ amount, email, name, onSuccess, onClose }) => {
    // Make sure your public key is in your .env file
    const config = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY, 
        tx_ref: Date.now().toString(),
        amount: amount,
        currency: 'NGN',
        payment_options: 'card,banktransfer,ussd',
        customer: { email, name },
        customizations: { title: 'TrustPayEcommerce', description: 'Payment for goods' },
    };

    const handleFlutterPayment = useFlutterwave(config);

    return (
        <button onClick={() => handleFlutterPayment({ callback: onSuccess, onClose })}>
            Pay Now
        </button>
    );
};

export default FlutterwaveButton;