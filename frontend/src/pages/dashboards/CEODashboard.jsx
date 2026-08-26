import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import CEOAIAssistant from '../../components/AI/CEOAIAssistant';

export default function CEODashboard() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/ceo/daily-report')
      .then(res => setReport(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center font-bold text-gray-600">Loading CEO Control Center...</div>;
  if (!report) return <div className="p-12 text-center text-red-500">Failed to load CEO report data.</div>;

  const { businessOverview, financialOverview, attentionItems, systemHealth, aiInsights } = report;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      <div className="bg-[#0B1B3A] text-white p-8 rounded-xl shadow-lg mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">CEO Control Center</h1>
          <p className="text-gray-300 mt-1 text-sm">TrustPayEcommerce Autonomous Operations & Intelligence Suite</p>
        </div>
        <div className="bg-green-600 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
          System Health: {systemHealth}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-xs font-semibold text-gray-400 uppercase">Monthly Revenue</p>
          <h3 className="text-2xl font-black text-[#FF6A00] mt-1">₦{financialOverview.monthlyRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-xs font-semibold text-gray-400 uppercase">Active Escrow Volume</p>
          <h3 className="text-2xl font-black text-[#0B1B3A] mt-1">₦{financialOverview.activeEscrowVolume.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Platform Users</p>
          <h3 className="text-2xl font-black text-blue-600 mt-1">{businessOverview.totalUsers.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-xs font-semibold text-gray-400 uppercase">Total Orders</p>
          <h3 className="text-2xl font-black text-purple-600 mt-1">{businessOverview.totalOrders.toLocaleString()}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold text-[#0B1B3A] mb-4">Requires CEO Attention</h2>
            {attentionItems.length === 0 ? (
              <p className="text-gray-500 text-sm">No pending approvals or high-priority alerts.</p>
            ) : (
              <div className="space-y-4">
                {attentionItems.map(item => (
                  <div key={item._id} className="p-4 border rounded-lg bg-orange-50 border-orange-200 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold bg-orange-600 text-white px-2 py-0.5 rounded">{item.riskLevel}</span>
                      <p className="font-semibold text-gray-800 mt-1">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Department: {item.aiDepartment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-xl shadow border">
            <h2 className="text-xl font-bold text-[#0B1B3A] mb-4">AI Business Insights</h2>
            <ul className="space-y-3">
              {aiInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                  <span className="text-[#FF6A00] font-bold mr-2">▪</span> {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <CEOAIAssistant />
        </div>
      </div>
    </div>
  );
}