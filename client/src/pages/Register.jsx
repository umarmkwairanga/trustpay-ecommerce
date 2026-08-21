import React, { useState } from 'react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'buyer', businessName: '', country: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (res.ok) alert('Registration successful! Pending verification if provider.');
    else alert(data.message);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Join TrustPayEcommerce</h2>
      
      <label className="block mb-2">How do you want to use TrustPayEcommerce?</label>
      <select 
        value={formData.role} 
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="w-full p-2 border mb-4 rounded"
      >
        <option value="buyer">Buyer</option>
        <option value="seller">Product Seller</option>
        <option value="rider">Delivery Partner / Rider</option>
        <option value="flight_provider">Flight Provider</option>
        <option value="hotel_provider">Hotel / Accommodation Provider</option>
        <option value="restaurant_provider">Restaurant / Food Provider</option>
        <option value="vehicle_provider">Vehicle Provider</option>
        <option value="real_estate_provider">Real Estate Provider</option>
        <option value="service_provider">Service Provider</option>
      </select>

      <input 
        type="text" placeholder="Full Name" 
        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
        className="w-full p-2 border mb-3 rounded" required 
      />
      <input 
        type="email" placeholder="Email Address" 
        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
        className="w-full p-2 border mb-3 rounded" required 
      />
      <input 
        type="password" placeholder="Password" 
        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
        className="w-full p-2 border mb-4 rounded" required 
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Register Account</button>
    </form>
  );
}