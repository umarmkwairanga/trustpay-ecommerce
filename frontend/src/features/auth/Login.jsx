// src/features/auth/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate a successful login
    login({ email: email, name: 'User' });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Login to TrustPayEcommerce</h2>
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          importd
        />
        
        <button 
          type="submit" 
          className="w-full bg-orange-500 text-white py-3 rounded font-bold hover:bg-orange-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}