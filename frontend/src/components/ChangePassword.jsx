import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/auth/change-password', 
        { password: newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Password updated! Please login again.');
      navigate('/login');
    } catch (err) {
      alert('Failed to update password');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <h2>Update Password</h2>
      <p>For your security, you must change your temporary password.</p>
      <form onSubmit={handleSubmit}>
        <input 
          type="password" 
          placeholder="New Password" 
          onChange={(e) => setNewPassword(e.target.value)} 
          required 
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;