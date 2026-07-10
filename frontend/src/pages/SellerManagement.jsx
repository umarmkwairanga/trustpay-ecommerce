import React, { useEffect, useState } from 'react';

const SellerManagement = () => {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    fetch('/api/admin/sellers')
      .then((res) => res.json())
      .then((data) => setSellers(data));
  }, []);

  const handleUpdate = (sellerId, status) => {
    fetch('/api/admin/update-seller-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId, status }),
    }).then(() => {
      setSellers(sellers.map(s => s._id === sellerId ? { ...s, sellerStatus: status } : s));
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Seller Applications & Management</h1>
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">Seller Name</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Documents</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="p-4">{s.name}</td>
                <td className="p-4 capitalize">{s.sellerStatus || 'Pending'}</td>
                <td className="p-4">
                  <a href={s.documentUrl} target="_blank" className="text-blue-600 underline">View Docs</a>
                </td>
                <td className="p-4 space-x-2">
                  <button onClick={() => handleUpdate(s._id, 'Approved')} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                  <button onClick={() => handleUpdate(s._id, 'Rejected')} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerManagement;