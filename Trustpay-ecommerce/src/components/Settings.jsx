import React, { useState } from 'react';
import { updateUserSettings } from '../api/userApi'; // Import the function we created

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    idType: 'National ID',
    paymentDetails: { bankName: '', accountNumber: '', accountHolderName: '' }
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateUserSettings(formData);
      setMessage('Settings updated successfully!');
      console.log(result);
    } catch (error) {
      setMessage('Failed to update: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="settings-form">
      <h2>Account Settings</h2>
      <input 
        type="text" 
        placeholder="Full Name" 
        onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
      />
      <input 
        type="text" 
        placeholder="ID Number" 
        onChange={(e) => setFormData({...formData, idNumber: e.target.value})} 
      />
      
      {/* Example for nested bank data */}
      <input 
        type="text" 
        placeholder="Bank Name" 
        onChange={(e) => setFormData({
            ...formData, 
            paymentDetails: {...formData.paymentDetails, bankName: e.target.value}
        })} 
      />
      
      <button type="submit">Save Changes</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default Settings;