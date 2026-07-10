import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const res = await api.get('/admin/orders');
                setOrders(res.data);
            } catch (err) {
                setError("Failed to load orders. Ensure you have admin access.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading orders...</div>;
    if (error) return <div className="p-10 text-center" style={{ color: '#EF4444' }}>{error}</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#001F5B' }}>Order Management</h2>
            
            {/* Using 'card' class for consistent background and border */}
            <div className="card shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <li key={order._id} className="p-4 hover:bg-gray-50">
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-semibold" style={{ color: '#001F5B' }}>Order: {order._id.slice(-6)}</p>
                                    <p className="text-sm text-gray-500">Buyer: {order.buyer?.username || 'Unknown'}</p>
                                </div>
                                <div className="text-right">
                                    {/* Applying Official Status Colors */}
                                    <span 
                                        className="px-2 py-1 rounded text-xs font-bold" 
                                        style={{ 
                                            backgroundColor: order.status === 'flagged' ? '#FEE2E2' : '#DCFCE7',
                                            color: order.status === 'flagged' ? '#EF4444' : '#22C55E' 
                                        }}
                                    >
                                        {order.status.toUpperCase()}
                                    </span>
                                    <p className="text-sm mt-1 font-medium">₦{order.totalAmount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminOrders;