import React, { useState } from 'react';
import axios from 'axios';

const OrderDashboard = ({ orderId }) => {
    const [loading, setLoading] = useState(false);

    const confirmOrder = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3000/api/orders/confirm-delivery/${orderId}`, 
                {}, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(response.data.message);
            // Optionally refresh the order status here
        } catch (error) {
            alert("Failed to confirm delivery");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="order-card">
            <h3>Order ID: {orderId}</h3>
            <button onClick={confirmOrder} disabled={loading}>
                {loading ? "Processing..." : "Confirm Delivery"}
            </button>
        </div>
    );
};

export default OrderDashboard;