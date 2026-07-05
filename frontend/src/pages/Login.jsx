import React, { useState } from 'react';
import API from '../api'; // Use your custom API instance

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/users/login', formData);
            // Store the token securely
            localStorage.setItem('token', res.data.token);
            alert("Login successful!");
            window.location.href = '/dashboard';
        } catch (err) {
            alert("Login failed: " + err.response?.data?.message || "Error");
        }
    };

    return (
        <form onSubmit={handleLogin} className="p-6 max-w-sm mx-auto border rounded">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <input 
                type="email" 
                placeholder="Email" 
                className="w-full mb-3 p-2 border"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
                type="password" 
                placeholder="Password" 
                className="w-full mb-3 p-2 border"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
                Sign In
            </button>
        </form>
    );
};

export default Login;