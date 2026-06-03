import React, { useState } from 'react';

const EscrowDashboard = () => {
  const [buyerId, setBuyerId] = useState('buyer_user_ng');
  const [sellerId, setSellerId] = useState('seller_user_ng');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');

  // Handle creating a new secure escrow payment hold in Naira
  const handleCreateEscrow = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://127.0.0.1:5000/api/escrow/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId, sellerId, amount: Number(amount) }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setTransactions([...transactions, data.transaction]);
        setMessage(`🔒 Funds successfully secured in TrustPay Escrow!`);
        setAmount('');
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Failed to communicate with the escrow server.');
    }
  };

  // Handle releasing held funds directly to a seller
  const handleReleaseFunds = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/escrow/release/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setTransactions(transactions.map(t => t._id === id ? { ...t, status: 'RELEASED' } : t));
        setMessage(`💰 Funds successfully transferred to the vendor!`);
      } else {
        setMessage(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Failed to release escrow funds.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ borderBottom: '2px solid #006633', paddingBottom: '10px', color: '#006633' }}>🛡️ TrustPay Escrow Hub (NGN)</h2>
      
      {/* Create Transaction Form */}
      <form onSubmit={handleCreateEscrow} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '30px', border: '1px solid #ddd' }}>
        <h3>Secure a New Local Payment</h3>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontWeight: 'bold' }}>Amount to Lock (NGN ₦): </label>
          <div style={{ position: 'relative', marginTop: '5px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '8px', fontWeight: 'bold', color: '#555' }}>₦</span>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px 8px 8px 25px', boxSizing: 'border-box' }} 
              placeholder="e.g. 50000" 
            />
          </div>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#006633', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
          Deposit Naira Into Escrow
        </button>
      </form>

      {message && <div style={{ padding: '10px', background: '#e6ffed', borderLeft: '4px solid #006633', marginBottom: '20px', color: '#004d26' }}>{message}</div>}

      {/* Active Transactions Ledger */}
      <h3>Active TrustPay Holds</h3>
      {transactions.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No active escrow transactions found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {transactions.map((tx) => (
            <div key={tx._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '6px', background: tx.status === 'RELEASED' ? '#e6ffed' : '#fff3cd' }}>
              <p><strong>Transaction ID:</strong> {tx._id}</p>
              <p><strong>Amount Secured:</strong> ₦{tx.amount.toLocaleString()}</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: tx.status === 'RELEASED' ? 'green' : 'orange' }}>{tx.status}</span></p>
              
              {tx.status === 'HELD' && (
                <button onClick={() => handleReleaseFunds(tx._id)} style={{ marginTop: '10px', padding: '6px 12px', backgroundColor: '#006633', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Release ₦{tx.amount.toLocaleString()} to Seller
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EscrowDashboard;