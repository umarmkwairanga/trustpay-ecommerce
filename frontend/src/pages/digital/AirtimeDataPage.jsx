import React, { useState } from 'react';
import API from '../../services/api';

export default function AirtimeDataPage() {
  const [network, setNetwork] = useState('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAirtimePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const idempotencyKey = `idemp-${Date.now()}-${Math.random()}`;
      const res = await API.post('/digital/airtime/purchase', {
        network, phoneNumber, amount, idempotencyKey
      });
      setResult(res.data.transaction);
      alert('Airtime purchase successful!');
    } catch (err) {
      alert(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      <div className="bg-[#0B1B3A] text-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold">Buy Airtime & Data</h1>
        <p className="text-gray-300 text-sm mt-1">Instant top-up across Nigerian mobile networks.</p>
      </div>

      <form onSubmit={handleAirtimePurchase} className="bg-white p-6 rounded shadow border space-y-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Select Network</label>
          <select value={network} onChange={e => setNetwork(e.target.value)} className="w-full border p-2 rounded">
            <option value="MTN">MTN</option>
            <option value="GLO">GLO</option>
            <option value="AIRTEL">Airtel</option>
            <option value="9MOBILE">9mobile</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
          <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="08012345678" className="w-full border p-2 rounded" required />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Amount (₦)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="1000" className="w-full border p-2 rounded" required />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-[#FF6A00] text-white py-2 rounded font-bold hover:bg-orange-700 transition">
          {loading ? 'Processing...' : 'Pay & Top Up'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 p-4 rounded text-green-800">
          <h3 className="font-bold">Transaction Successful</h3>
          <p className="text-sm">Reference: {result.reference}</p>
          <p className="text-sm">Total Paid: ₦{result.totalAmount}</p>
        </div>
      )}
    </div>
  );
}