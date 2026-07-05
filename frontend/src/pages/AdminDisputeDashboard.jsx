import React, { useState, useEffect } from 'react';
import API from '../api';

const AdminDisputeDashboard = () => {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDisputes = async () => {
            try {
                // Assuming you add a GET route in orderRoutes.js for this
                const { data } = await API.get('/orders/admin/disputes');
                setDisputes(data);
            } catch (err) {
                console.error("Failed to fetch disputes");
            } finally {
                setLoading(false);
            }
        };
        fetchDisputes();
    }, []);

    const handleResolve = async (orderId, resolution) => {
        try {
            await API.put('/orders/admin/resolve', { orderId, resolution });
            setDisputes(disputes.filter(d => d._id !== orderId));
            alert(`Dispute resolved as: ${resolution}`);
        } catch (err) {
            alert("Resolution failed");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading disputes...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Escrow Dispute Center</h1>
            
            {/* Added Empty State Check */}
            {disputes.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-600">No active disputes to resolve. Great job!</p>
                </div>
            ) : (
                disputes.map(order => (
                    <div key={order._id} className="card mb-4 p-4 border rounded shadow">
                        <h3 className="font-bold">Order: {order._id}</h3>
                        <p>Reason: {order.disputeNotes}</p>
                        <div className="flex gap-4 mt-4">
                            <button 
                                onClick={() => handleResolve(order._id, 'release-to-seller')}
                                className="bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
                            >
                                Release to Seller
                            </button>
                            <button 
                                onClick={() => handleResolve(order._id, 'refund-to-buyer')}
                                className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                            >
                                Refund Buyer
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminDisputeDashboard;