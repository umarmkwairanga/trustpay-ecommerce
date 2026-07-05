import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderTracker = ({ orderId }) => {
    const [order, setOrder] = useState(null);

    const fetchOrder = async () => {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
    };

    useEffect(() => { fetchOrder(); }, [orderId]);

    const handleConfirmDelivery = async () => {
        await axios.put(`/api/orders/${orderId}/confirm-delivery`);
        fetchOrder(); // Refresh status after payout
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="p-4 border rounded shadow-md">
            <h3>Order Status: <span className="font-bold">{order.status}</span></h3>
            
            {order.status === 'paid' && (
                <button onClick={handleConfirmDelivery} className="bg-green-600 text-white p-2 mt-2">
                    Confirm Delivery & Release Funds
                </button>
            )}
            
            {order.status === 'delivered' && <p>✅ Funds have been released to the seller.</p>}
        </div>
    );
};

export default OrderTracker;