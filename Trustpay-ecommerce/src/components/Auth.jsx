import React, { useState } from 'react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Using direct IP addresses to prevent localhost translation drops
    const url = isLogin 
      ? 'http://127.0.0.1:5000/login' 
      : 'http://127.0.0.1:5000/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`🎉 ${data.message || 'Success!'}`);
        if (!isLogin) setFormData({ name: '', email: '', password: '' });
      } else {
        setMessage(`❌ Error: ${data.message || 'Something went wrong'}`);
      }
    } catch (err) {
      setMessage('❌ Connection blocked. Try opening the web link below instead!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'Arial, sans-serif' }}>
      <h2>{isLogin ? 'TrustPayEcommerce Login' : 'TrustPayEcommerce Registration'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '15px' }}>
            <label>Full Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} importd style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
        )}
        <div style={{ marginBottom: '15px' }}>
          <label>Email Address:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} importd style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} importd style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLogin ? 'Log In' : 'Register Account'}
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center', cursor: 'pointer', color: '#0070f3' }} onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
        {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
      </p>
      {message && <div style={{ marginTop: '15px', padding: '10px', background: '#f0f0f0', borderLeft: '4px solid #0070f3', fontSize: '14px' }}>{message}</div>}
    </div>
  );
};

export default Auth;