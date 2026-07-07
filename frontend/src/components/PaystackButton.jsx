import React from 'react';
import { usePaystackPayment } from 'react-paystack';
import axios from 'axios';

const FlutterwaveButton = ({ amount, email, items, sellerId, onSuccess }) => {
    // 1. Generate unique reference from backend
    const config = {
        reference: (new Date()).getTime().toString(),
        email,
        amount: amount * 100, // Paystack uses kobo
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    };

    const initializePayment = usePaystackPayment(config);

    const handlePaystackSuccess = async (reference) => {
        // 2. Tell backend to create order & verify payment
        await axios.post('/api/orders', { 
            items, totalAmount: amount, reference: reference.reference, sellerId 
        });
        await axios.post('/api/orders/verify-payment', { reference: reference.reference });
        onSuccess();
    };

    return (
        <button onClick={() => initializePayment(handlePaystackSuccess, () => console.log('Closed'))}>
            Pay Now
        </button>
    );
};

export default FlutterwaveButton;