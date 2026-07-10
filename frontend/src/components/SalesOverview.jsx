import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SalesOverview = () => {
    const [orders, setOrders] = useState([]);

    // 1. Fetch orders from your backend
    useEffect(() => {
        const fetchOrders = async () => {
            const res = await axios.get('/api/orders/seller-orders', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setOrders(res.data);
        };
        fetchOrders();
    }, []);

    // 2. Action to ship order (Updates status to 'shipped')
    const markAsShipped = async (orderId) => {
        await axios.put(`/api/orders/${orderId}/ship`);
        alert("Order status updated to shipped!");
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Your Sales</h2>
            <table className="w-full border-collapse border">
                <thead>
                    <tr>
                        <th className="border p-2">Order ID</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td className="border p-2">{order._id.slice(-6)}</td>
                            <td className="border p-2">₦{order.totalAmount}</td>
                            <td className="border p-2 font-bold">{order.status}</td>
                            <td className="border p-2">
                                {order.status === 'paid' && (
                                    <button onClick={() => markAsShipped(order._id)} className="bg-blue-500 text-white p-1 rounded">
                                        Mark as Shipped
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesOverview;