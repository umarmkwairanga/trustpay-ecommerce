// src/pages/BuyerDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const BuyerDashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch orders specific to this user
        fetch(`http://localhost:3000/api/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setOrders(data));
    }, []);

    return (
        <div className="p-6">
            {/* Added styling to match brand system */}
            <h1 className="text-2xl font-bold" style={{ color: '#001F5B' }}>
                Welcome, {user.username}
            </h1>
            
            <section className="mt-6 card">
                <h2 className="text-xl" style={{ color: '#001F5B', marginBottom: '15px' }}>
                    My TrustPayEcommerceEcommerce Protected Orders
                </h2>
                
                {/* 
                   Example of how to style a button if you add one here:
                   <button className="btn-primary">View Details</button> 
                */}
                
                {/* Map through orders here */}
                {orders.length === 0 ? <p>No active escrow orders found.</p> : null}
            </section>
        </div>
    );
};

export default BuyerDashboard;