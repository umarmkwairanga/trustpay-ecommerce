import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EscrowAdminDashboard = () => {
  const [escrows, setEscrows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEscrow, setSelectedEscrow] = useState(null);

  useEffect(() => {
    fetchEscrows();
  }, []);

  const fetchEscrows = async () => {
    try {
      const { data } = await axios.get('/api/admin/escrow');
      setEscrows(data);
    } catch (err) {
      console.error("Failed to fetch escrows", err);
    }
  };

  const logAdminAction = async (action, targetId) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      admin: localStorage.getItem('adminEmail') || 'SystemAdmin',
      action: action,
      targetId: targetId
    };
    try {
      await axios.post('/api/admin/logs', logEntry);
    } catch (err) {
      console.error("Logging failed", err);
    }
  };

  const initiateRelease = (item) => {
    setSelectedEscrow(item);
    setShowModal(true);
  };

  const executeRelease = async () => {
    try {
      await axios.post(`/api/admin/escrow/release/${selectedEscrow._id}`);
      
      // Log the action
      await logAdminAction('Payout Released', selectedEscrow._id);
      
      fetchEscrows();
      setShowModal(false);
      alert("Payout triggered successfully");
    } catch (err) {
      alert("Error releasing funds: " + err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Escrow Management</h1>
      
      <table className="w-full mt-4 border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Seller</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {escrows.map(item => (
            <tr key={item._id} className="border-b">
              <td className="p-2 border">{item.seller?.name || "N/A"}</td>
              <td className="p-2 border">₦{item.sellerAmount?.toLocaleString()}</td>
              <td className="p-2 border">{item.status}</td>
              <td className="p-2 border">
                {item.status === 'holding' && (
                  <button 
                    onClick={() => initiateRelease(item)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Release Payout
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold mb-4">Confirm Release</h2>
            <p className="mb-6">
              Are you sure you want to release ₦{selectedEscrow?.sellerAmount.toLocaleString()} 
              to {selectedEscrow?.seller?.name}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowModal(false)} 
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={executeRelease} 
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EscrowAdminDashboard;