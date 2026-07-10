import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEscrowDashboard = () => {
    const [escrows, setEscrows] = useState([]);

    useEffect(() => {
        const fetchEscrows = async () => {
            try {
                // Ensure you have the token saved in localStorage after login
                const token = localStorage.getItem('token');
                const { data } = await axios.get('/api/escrows/admin/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEscrows(data);
            } catch (error) {
                console.error("Failed to fetch escrows", error);
            }
        };
        fetchEscrows();
    }, []);

    const handleRelease = async (id) => {
        try {
            await axios.patch(`/api/escrows/release/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert("Funds released!");
            window.location.reload(); // Simple way to refresh the data
        } catch (error) {
            alert("Error releasing funds");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Escrow Management</h1>
            <table className="min-w-full bg-white shadow-md rounded">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-3">Buyer</th>
                        <th className="p-3">Seller</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {escrows.map((escrow) => (
                        <tr key={escrow._id} className="border-t">
                            <td className="p-3">{escrow.buyer?.name}</td>
                            <td className="p-3">{escrow.seller?.name}</td>
                            <td className="p-3">₦{escrow.amount}</td>
                            <td className="p-3 uppercase">{escrow.status}</td>
                            <td className="p-3">
                                {escrow.status === 'holding' && (
                                    <button 
                                        onClick={() => handleRelease(escrow._id)}
                                        className="bg-green-500 text-white px-4 py-1 rounded"
                                    >
                                        Release Funds
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

export default AdminEscrowDashboard;