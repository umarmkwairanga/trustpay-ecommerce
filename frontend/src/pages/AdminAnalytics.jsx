import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminAnalytics = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        verifiedUsers: 0,
        totalTransactions: 0,
        grossTransactionValue: 0,
        totalCommission: 0, // Added field
        pendingDisputes: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/admin/analytics');
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching analytics:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold mb-6">Admin Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { title: "Total Users", value: stats.totalUsers },
                    { title: "Verified Users", value: stats.verifiedUsers },
                    { title: "Total Transactions", value: stats.totalTransactions },
                    { title: "Gross Value (₦)", value: stats.grossTransactionValue.toLocaleString() },
                    { title: "Total Commission (₦)", value: stats.totalCommission.toLocaleString() }, // New UI element
                    { title: "Pending Disputes", value: stats.pendingDisputes }
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 shadow rounded-lg border-t-4 border-blue-500">
                        <p className="text-gray-500 text-sm">{stat.title}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminAnalytics;