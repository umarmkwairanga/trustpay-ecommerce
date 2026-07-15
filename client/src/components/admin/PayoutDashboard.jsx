import React, { useEffect, useState } from 'react';
// Import your configured api instance instead of raw axios
import api from '../../axiosConfig'; 

const PayoutDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayouts = async () => {
            try {
                // Use the 'api' instance which automatically attaches the JWT token
                const { data } = await api.get('/api/orders/payout-queue');
                setOrders(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching payouts:", error);
                setLoading(false);
            }
        };
        fetchPayouts();
    }, []);

    const handleReleasePayment = async (orderId) => {
        try {
            // This calls your backend to trigger the actual Flutterwave payout
            await api.put(`/api/orders/release-payout/${orderId}`);
            alert('Payout successful!');
            // Refresh the list after successful payout
            setOrders(orders.filter(o => o._id !== orderId));
        } catch (error) {
            alert('Failed to release payment.');
            console.error(error);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading CEO Dashboard...</div>;

    return (
        <div className="payout-container p-6">
            <h1 className="text-2xl font-bold mb-4">CEO Payout Approval Queue</h1>
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Order ID</th>
                        <th className="p-2 border">Seller</th>
                        <th className="p-2 border">Amount</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} className="text-center">
                            <td className="p-2 border">{order._id.slice(-6)}</td>
                            <td className="p-2 border">{order.seller?.username || 'N/A'}</td>
                            <td className="p-2 border">₦{order.totalAmount}</td>
                            <td className="p-2 border">{order.status}</td>
                            <td className="p-2 border">
                                <button 
                                    onClick={() => handleReleasePayment(order._id)}
                                    className="bg-green-600 text-white px-4 py-1 rounded"
                                >
                                    Release Funds
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PayoutDashboard;