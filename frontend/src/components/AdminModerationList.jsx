import React, { useState, useEffect } from 'react';

function AdminModerationList() {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [message, setMessage] = useState(''); // Added for Toast notification

  useEffect(() => {
    fetch('http://localhost:3000/api/products?status=pending')
      .then((res) => res.json())
      .then((data) => setPendingProducts(data))
      .catch((err) => console.error("Error fetching pending items:", err));
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            status: newStatus,
            adminName: 'SuperAdmin' 
        })
      });

      if (response.ok) {
        setPendingProducts(pendingProducts.filter(p => p._id !== id));
        
        // Trigger Toast Notification
        setMessage(`Product successfully ${newStatus}!`);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      }
    } catch (err) {
      setMessage('Error updating product. Please try again.');
    }
  };

  return (
    <div>
      <h2>Pending Moderation Queue</h2>
      
      {/* Toast Notification display */}
      {message && <div style={{ background: '#d4edda', padding: '10px', marginBottom: '10px' }}>{message}</div>}

      {pendingProducts.length === 0 ? (
        <p>No products currently pending moderation.</p>
      ) : (
        pendingProducts.map((p) => (
          <div key={p._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><strong>{p.name}</strong> - ${p.price}</p>
            <button onClick={() => handleStatusUpdate(p._id, 'approved')}>Approve</button>
            <button onClick={() => handleStatusUpdate(p._id, 'rejected')}>Reject</button>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminModerationList;