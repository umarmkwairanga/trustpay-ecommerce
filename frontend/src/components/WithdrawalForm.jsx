import React, { useState } from 'react';
import API from '../api'; // Your axios instance

const WithdrawalForm = ({ walletBalance }) => {
  const [formData, setFormData] = useState({
    amount: '',
    bankName: '',
    accountNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.amount > walletBalance) {
      alert("Insufficient balance!");
      return;
    }

    setLoading(true);
    try {
      await API.post('/withdrawal/request', formData);
      alert("Withdrawal request submitted successfully!");
      setFormData({ amount: '', bankName: '', accountNumber: '' });
    } catch (err) {
      alert("Failed to submit request: " + err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md">
      <h2 className="text-xl font-bold mb-4">Request Withdrawal</h2>
      <p className="text-sm text-gray-600 mb-4">Available Balance: ₦{walletBalance.toLocaleString()}</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="number" placeholder="Amount (₦)" required
          className="w-full p-2 border rounded"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
        />
        <input 
          type="text" placeholder="Bank Name" required
          className="w-full p-2 border rounded"
          value={formData.bankName}
          onChange={(e) => setFormData({...formData, bankName: e.target.value})}
        />
        <input 
          type="text" placeholder="Account Number" required
          className="w-full p-2 border rounded"
          value={formData.accountNumber}
          onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
        />
        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          {loading ? 'Processing...' : 'Request Payout'}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;