import React from 'react';

export default function EcosystemOverviewWidget({ data }) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Marketplace Orders</p>
        <h4 className="text-2xl font-black text-[#0B1B3A] mt-1">{data.businessOverview?.totalOrders || 0}</h4>
      </div>
      <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Escrow</p>
        <h4 className="text-2xl font-black text-[#FF6A00] mt-1">₦{(data.financialOverview?.activeEscrow || 0).toLocaleString()}</h4>
      </div>
      <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Ecosystem Users</p>
        <h4 className="text-2xl font-black text-blue-600 mt-1">{data.businessOverview?.totalUsers || 0}</h4>
      </div>
      <div className="bg-white p-5 rounded-xl shadow border border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Platform Revenue</p>
        <h4 className="text-2xl font-black text-green-600 mt-1">₦{(data.financialOverview?.totalRevenue || 0).toLocaleString()}</h4>
      </div>
    </div>
  );
}