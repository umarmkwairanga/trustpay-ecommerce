import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    bankName: '',
    accountNumber: '',
    idNumber: '',
    is2FAEnabled: false,
    smsAlerts: true,
    emailUpdates: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/users/update-settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) alert("Settings saved successfully!");
      else alert("Failed to save settings.");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'payment', label: 'Payment' },
    { id: 'verification', label: 'KYC & Trust' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'audit', label: 'Audit Log' }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Account Settings</h1>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 15px', cursor: 'pointer', background: activeTab === tab.id ? '#007bff' : '#f8f9fa', color: activeTab === tab.id ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>{tab.label}</button>
        ))}
      </div>

      <div style={{ background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
        <form onSubmit={handleSave}>
          {activeTab === 'profile' && (
            <>
              <h3>Personal Information</h3>
              <input name="fullName" placeholder="Full Legal Name" style={inputStyle} onChange={handleChange} />
              <input name="email" placeholder="Email Address" style={inputStyle} onChange={handleChange} />
              <input name="phoneNumber" placeholder="Phone Number" style={inputStyle} onChange={handleChange} />
            </>
          )}

          {activeTab === 'security' && (
            <>
              <h3>Security Settings</h3>
              <label><input type="checkbox" name="is2FAEnabled" onChange={handleChange} /> Enable 2FA (Recommended for Escrow)</label>
            </>
          )}

          {activeTab === 'payment' && (
            <>
              <h3>Flutterwave Payout Details</h3>
              <input name="bankName" placeholder="Bank Name" style={inputStyle} onChange={handleChange} />
              <input name="accountNumber" placeholder="NUBAN Account Number" style={inputStyle} onChange={handleChange} />
            </>
          )}

          {activeTab === 'verification' && (
            <>
              <h3>Identity Verification (KYC)</h3>
              <input name="idNumber" placeholder="BVN or NIN Number" style={inputStyle} onChange={handleChange} />
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h3>Alerts</h3>
              <label><input type="checkbox" name="smsAlerts" checked={formData.smsAlerts} onChange={handleChange} /> SMS Transaction Updates</label><br />
              <label><input type="checkbox" name="emailUpdates" checked={formData.emailUpdates} onChange={handleChange} /> Email Escrow Receipts</label>
            </>
          )}

          {activeTab !== 'audit' && <button type="submit" style={btnStyle}>Save Changes</button>}
        </form>

        {activeTab === 'audit' && (
          <div>
            <h3>Recent Activity</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#eee' }}><th style={thStyle}>Date</th><th style={thStyle}>Action</th></tr></thead>
              <tbody><tr><td style={tdStyle}>2026-07-13</td><td style={tdStyle}>Login</td></tr></tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle = { display: 'block', margin: '10px 0', width: '95%', padding: '10px' };
const btnStyle = { padding: '10px 20px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '10px' };
const thStyle = { padding: '10px', textAlign: 'left' };
const tdStyle = { padding: '10px', borderBottom: '1px solid #eee' };

export default Settings;