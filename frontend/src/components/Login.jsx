import React, { useState } from 'react';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            
            // Ensure this key matches what your axios interceptor looks for
            localStorage.setItem('jwt_token', response.data.token);
            localStorage.setItem('user_role', response.data.role); // Store role for ProtectedRoute
            
            // Redirect based on role
            window.location.href = response.data.role === 'admin' ? '/admin/payouts' : '/rider-dashboard';
        } catch (err) {
            alert("Login failed: " + (err.response?.data?.message || "Check your credentials"));
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input 
                type="email" 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email" 
                required 
            />
            <input 
                type="password" 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                required 
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;