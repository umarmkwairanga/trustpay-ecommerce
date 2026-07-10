import React, { useEffect, useState } from 'react';

const TransactionLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/transaction-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Refunded': return 'bg-red-100 text-red-800';
      case 'Disputed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Audit Logs...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">System Transaction Logs</h1>
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Escrow ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{new Date(log.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-sm font-mono">{log._id}</td>
                <td className="px-6 py-4 text-sm font-bold">₦{log.amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(log.status)}`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionLogs;