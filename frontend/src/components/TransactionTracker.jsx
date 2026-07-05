import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionTracker = ({ orderId }) => {
    const [status, setStatus] = useState('Loading...');

    useEffect(() => {
        const fetchStatus = async () => {
            const res = await axios.get(`/api/orders/${orderId}`);
            setStatus(res.data.status);
        };
        fetchStatus();
    }, [orderId]);

    return (
        <div className="tracker-card">
            <h3>Transaction Status</h3>
            <div className={`status-badge ${status.toLowerCase()}`}>
                {status}
            </div>
            
            {status === 'paid' && <p>Funds are securely held in escrow.</p>}
            {status === 'delivered' && <p>Funds have been released to the seller.</p>}
        </div>
    );
};

export default TransactionTracker;