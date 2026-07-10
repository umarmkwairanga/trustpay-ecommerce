import React, { useEffect, useState } from 'react';

const DisputeManager = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null); // Track ID of active processing

  useEffect(() => {
    fetch('/api/admin/disputes')
      .then((res) => res.json())
      .then((data) => {
        setDisputes(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching disputes:", err));
  }, []);

  const handleResolve = (escrowId, resolution) => {
    setProcessing(escrowId); // Disable buttons for this item
    fetch('/api/admin/resolve-dispute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ escrowId, resolution }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setDisputes(disputes.filter((d) => d._id !== escrowId));
      })
      .catch((err) => alert("Resolution failed: " + err.message))
      .finally(() => setProcessing(null));
  };

  if (loading) return <div className="p-10 text-center">Loading Active Disputes...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Active Dispute Management</h1>
      
      {disputes.length === 0 ? (
        <div className="text-gray-500 text-center p-10">No active disputes to resolve.</div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Escrow ID</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((d) => (
                <tr key={d._id} className="border-b">
                  <td className="px-6 py-4 font-mono text-sm">{d._id}</td>
                  <td className="px-6 py-4">₦{d.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      disabled={processing === d._id}
                      onClick={() => handleResolve(d._id, 'refund')} 
                      className={`px-3 py-1 rounded text-white ${processing === d._id ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {processing === d._id ? 'Processing...' : 'Refund'}
                    </button>
                    <button 
                      disabled={processing === d._id}
                      onClick={() => handleResolve(d._id, 'release')} 
                      className={`px-3 py-1 rounded text-white ${processing === d._id ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {processing === d._id ? 'Processing...' : 'Release'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DisputeManager;