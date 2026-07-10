import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../services/apiClient';

const Success = () => {
    const [searchParams] = useSearchParams();
    const tx_ref = searchParams.get('tx_ref'); // Flutterwave passes this in the URL
    const [status, setStatus] = useState('Verifying...');

    useEffect(() => {
        // Here you could hit a GET /api/orders/verify/:tx_ref endpoint
        // to confirm the order status from your DB
        apiClient.get(`/orders/verify/${tx_ref}`)
            .then(res => setStatus('Payment Confirmed! Your order is in Escrow.'))
            .catch(() => setStatus('Payment processing... check back in a moment.'));
    }, [tx_ref]);

    return <div>{status}</div>;
};