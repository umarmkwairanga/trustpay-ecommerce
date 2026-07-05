import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TransactionTracker from '../components/TransactionTracker';

const OrderDetails = () => {
    const { orderId } = useParams(); // Gets the ID from the URL
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/${orderId}`);
                setOrder(res.data);
            } catch (err) {
                console.error("Error fetching order details", err);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (!order) return <div>Loading order details...</div>;

    return (
        <div className="order-details-container">
            <h1>Order #{order._id}</h1>
            <p>Product: {order.items[0]?.name}</p>
            
            {/* The component we created earlier */}
            <TransactionTracker status={order.status} />
        </div>
    );
};

export default OrderDetails;