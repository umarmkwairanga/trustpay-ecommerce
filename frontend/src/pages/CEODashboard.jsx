import React, { useEffect, useState } from 'react';
import RevenueChart from '../components/RevenueChart';

const CEODashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch aggregated data from your backend
    fetch('/api/admin/dashboard-stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading Strategic Data...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">CEO Strategic Overview</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <KPICard 
          title="Total Revenue" 
          value={`₦${stats?.transactionStats[0]?.totalVolume?.toLocaleString() || 0}`} 
          color="bg-green-100 text-green-800" 
        />
        <KPICard 
          title="Total Transactions" 
          value={stats?.transactionStats[0]?.totalTransactions?.toLocaleString() || 0} 
          color="bg-blue-100 text-blue-800" 
        />
        <KPICard 
          title="Active Escrow" 
          value={`₦${stats?.transactionStats[0]?.pendingEscrow?.toLocaleString() || 0}`} 
          color="bg-yellow-100 text-yellow-800" 
        />
        <KPICard 
          title="Total Users" 
          value={stats?.totalUsers?.toLocaleString() || 0} 
          color="bg-purple-100 text-purple-800" 
        />
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Revenue Trend (Last 30 Days)</h2>
        {/* Integrated Recharts Component */}
        <RevenueChart data={stats?.revenueData || []} />
      </div>
    </div>
  );
};

// Sub-component for clean cards
const KPICard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow ${color}`}>
    <h3 className="text-sm font-medium uppercase opacity-75">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default CEODashboard;