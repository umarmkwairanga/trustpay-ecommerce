import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RiderDashboard = () => {
    const { user } = useContext(AuthContext);
    const [deliveries, setDeliveries] = useState([]);

    // Fetch deliveries assigned to this rider
    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const res = await axios.get(`/api/delivery/rider/${user._id}`);
                setDeliveries(res.data);
            } catch (err) {
                console.error("Error fetching deliveries", err);
            }
        };
        fetchDeliveries();
    }, [user._id]);

    // Handle status change
    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`/api/delivery/${id}`, { status: newStatus });
            // Refresh list after update
            setDeliveries(deliveries.map(d => d._id === id ? { ...d, status: newStatus } : d));
        } catch (err) {
            alert("Failed to update status");
        }
    };

    return (
        <div>
            <h1>My Deliveries</h1>
            {deliveries.map(d => (
                <div key={d._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
                    <p>Order: {d.order}</p>
                    <p>Status: <strong>{d.status}</strong></p>
                    
                    {d.status !== 'delivered' && (
                        <button onClick={() => handleStatusUpdate(d._id, 'delivered')}>
                            Mark as Delivered
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default RiderDashboard;