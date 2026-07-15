import React, { useState, useEffect } from 'react';
import { updateUserSettings, getUserProfile } from '../api/userApi';

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    paymentDetails: { bankName: '', accountNumber: '', accountHolderName: '' }
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Load existing data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setFormData(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  // 2. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserSettings(formData);
      setMessage('Settings updated successfully!');
    } catch (error) {
      setMessage('Failed to update: ' + error.message);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      <h2>Account Settings</h2>
      
      <label>Full Name</label>
      <input 
        type="text" 
        value={formData.fullName}
        onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
      />

      <label>ID Number</label>
      <input 
        type="text" 
        value={formData.idNumber}
        onChange={(e) => setFormData({...formData, idNumber: e.target.value})} 
      />

      <fieldset>
        <legend>Payment Details</legend>
        <input 
            type="text" 
            placeholder="Bank Name"
            value={formData.paymentDetails.bankName}
            onChange={(e) => setFormData({
                ...formData, 
                paymentDetails: {...formData.paymentDetails, bankName: e.target.value}
            })} 
        />
        <input 
            type="text" 
            placeholder="Account Number"
            value={formData.paymentDetails.accountNumber}
            onChange={(e) => setFormData({
                ...formData, 
                paymentDetails: {...formData.paymentDetails, accountNumber: e.target.value}
            })} 
        />
      </fieldset>
      
      <button type="submit">Save Changes</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Settings;