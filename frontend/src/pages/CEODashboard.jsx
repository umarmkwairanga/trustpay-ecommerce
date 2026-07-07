import React, { useEffect, useState } from 'react';
import RevenueChart from '../components/RevenueChart';
import TranslationDashboard from '../components/TranslationDashboard'; 

const CEODashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch('/api/admin/dashboard-stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, []);

  // Show loading only for initial stats fetch
  if (loading && activeTab === 'overview') return <div className="p-10 text-center">Loading Strategic Data...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">CEO Strategic Overview</h1>

      {/* Tab Navigation */}
      <div className="flex space-x-6 mb-8 border-b border-gray-200 pb-2">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`font-semibold pb-2 border-b-2 transition ${activeTab === 'overview' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('translator')}
          className={`font-semibold pb-2 border-b-2 transition ${activeTab === 'translator' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
        >
          AI Translator
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {activeTab === 'overview' ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <KPICard title="Total Revenue" value={`₦${stats?.transactionStats[0]?.totalVolume?.toLocaleString() || 0}`} color="bg-green-100 text-green-800" />
              <KPICard title="Total Transactions" value={stats?.transactionStats[0]?.totalTransactions?.toLocaleString() || 0} color="bg-blue-100 text-blue-800" />
              <KPICard title="Active Escrow" value={`₦${stats?.transactionStats[0]?.pendingEscrow?.toLocaleString() || 0}`} color="bg-yellow-100 text-yellow-800" />
              <KPICard title="Total Users" value={stats?.totalUsers?.toLocaleString() || 0} color="bg-purple-100 text-purple-800" />
            </div>

            {/* Revenue Trend Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Revenue Trend (Last 30 Days)</h2>
              <RevenueChart data={stats?.revenueData || []} />
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">AI-Driven Nigerian Language Translator</h2>
            <TranslationDashboard />
          </div>
        )}
      </div>
    </div>
  );
};

const KPICard = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow ${color}`}>
    <h3 className="text-sm font-medium uppercase opacity-75">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default CEODashboard;