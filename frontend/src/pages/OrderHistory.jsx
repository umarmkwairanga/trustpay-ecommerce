import React, { useState, useEffect } from 'react';
import api from '../services/api';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleConfirmDelivery = async (id) => {
        try {
            await api.patch(`/orders/${id}/confirm`);
            alert("Delivery confirmed! Funds released to seller.");
            fetchOrders(); 
        } catch (err) {
            alert("Failed to confirm delivery.");
        }
    };

    // Helper to get status colors
    const getStatusStyle = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'flagged': return 'bg-red-100 text-red-700 border-red-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">My TrustPayEcommerceEcommerce Orders</h2>
            {loading ? <p>Loading...</p> : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 shadow rounded-lg border-l-4 border-green-500">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">Order ID: {order._id.slice(-6)}</h3>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusStyle(order.status)}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                            
                            {/* Updated to Naira formatting */}
                            <p className="text-gray-600 mt-2 font-medium">
                                Total Paid: ₦{order.totalAmount.toLocaleString()}
                            </p>
                            
                            {order.status === 'paid' && (
                                <button 
                                    onClick={() => handleConfirmDelivery(order._id)}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Confirm Delivery & Release Funds
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;