import React, { useEffect, useState } from 'react';
import API from '../api';

const EscrowTable = () => {
  const [escrows, setEscrows] = useState([]);

  useEffect(() => {
    const fetchEscrows = async () => {
      const { data } = await API.get('/admin/escrows'); // Ensure this route is protected
      setEscrows(data);
    };
    fetchEscrows();
  }, []);

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-xl font-bold mb-4">Transaction Monitor</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-3">Date</th>
            <th className="p-3">Ref</th>
            <th className="p-3">Status</th>
            <th className="p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {escrows.map(e => (
            <tr key={e._id} className="border-b">
              <td className="p-3">{new Date(e.createdAt).toLocaleDateString()}</td>
              <td className="p-3 font-mono text-sm">{e.tx_ref}</td>
              <td className="p-3">
                <span className={`px-2 py-1 rounded text-xs ${
                  e.status === 'Funded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {e.status}
                </span>
              </td>
              <td className="p-3">₦{e.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EscrowTable;