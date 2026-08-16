import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCeoDashboard() {
  const [activeTab, setActiveTab] = useState('kpis');
  const [kpis, setKpis] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (activeTab === 'kpis') {
        const res = await axios.get('/api/ceo/bookings/kpis', { headers });
        if (res.data.success) setKpis(res.data.kpis);
      } else {
        const res = await axios.get('/api/admin/providers', { headers });
        if (res.data.success) setProviders(res.data.providers);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch executive data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (providerId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`/api/admin/providers/${providerId}/status`, 
        { verificationStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        alert(`Provider status updated to ${newStatus}`);
        fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update verification status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#F7F9FC] min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1B3A]">Admin & CEO Control Center</h1>
          <p className="text-gray-600 text-sm mt-1">Monitor platform GMV, commissions, and verify business providers.</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setActiveTab('kpis')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'kpis' ? 'bg-[#FF6A00] text-white' : 'bg-white text-[#0B1B3A] border border-gray-200'}`}
          >
            CEO Analytics & KPIs
          </button>
          <button 
            onClick={() => setActiveTab('providers')}
            className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'providers' ? 'bg-[#FF6A00] text-white' : 'bg-white text-[#0B1B3A] border border-gray-200'}`}
          >
            Provider Verification
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#0B1B3A]">Loading control center data...</div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl">{error}</div>
      ) : activeTab === 'kpis' && kpis ? (
        <div className="space-y-6">
          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase font-semibold text-gray-400">Total Gross Merchandise Value</span>
              <h2 className="text-2xl font-bold text-[#0B1B3A] mt-2">₦{kpis.totalGMV?.toLocaleString()}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase font-semibold text-gray-400">TrustPay Revenue (5%)</span>
              <h2 className="text-2xl font-bold text-[#1DBF73] mt-2">₦{kpis.platformRevenue?.toLocaleString()}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase font-semibold text-gray-400">Total Bookings</span>
              <h2 className="text-2xl font-bold text-[#2D7DFF] mt-2">{kpis.totalBookings}</h2>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <span className="text-xs uppercase font-semibold text-gray-400">Active Verified Providers</span>
              <h2 className="text-2xl font-bold text-[#FF6A00] mt-2">{kpis.activeProviders}</h2>
            </div>
          </div>

          {/* Breakdown Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0B1B3A] mb-4">Bookings by Status</h3>
              <div className="space-y-3">
                {kpis.bookingsByStatus?.map((statusObj) => (
                  <div key={statusObj._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">{statusObj._id || 'Unknown'}</span>
                    <span className="font-bold text-[#0B1B3A] bg-white px-3 py-1 rounded shadow-sm">{statusObj.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-[#0B1B3A] mb-4">Service Category Distribution</h3>
              <div className="space-y-3">
                {kpis.categoryBreakdown?.map((catObj) => (
                  <div key={catObj._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium uppercase text-gray-700">{catObj._id}</span>
                    <span className="font-bold text-[#0B1B3A] bg-white px-3 py-1 rounded shadow-sm">{catObj.count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#0B1B3A]">Business Providers Directory</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {providers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No registered business providers found.</div>
            ) : (
              providers.map((p) => (
                <div key={p._id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1B3A]">{p.businessName}</h3>
                    <p className="text-sm text-gray-600">Owner: {p.user?.name} ({p.user?.email})</p>
                    <p className="text-xs text-gray-400 mt-1">Category: <span className="uppercase font-semibold text-[#2D7DFF]">{p.category}</span></p>
                    <p className="text-xs text-gray-400 mt-0.5">Status: <span className="font-bold uppercase text-[#FF6A00]">{p.verificationStatus}</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateStatus(p._id, 'verified')}
                      className="bg-[#1DBF73] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90"
                    >
                      Verify
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(p._id, 'rejected')}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(p._id, 'suspended')}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90"
                    >
                      Suspend
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}