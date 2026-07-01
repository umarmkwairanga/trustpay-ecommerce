import React, { useState } from 'react';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevents page reload
        try {
            const response = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            window.location.href = '/dashboard'; // Redirect to your app's home/dashboard
        } catch (err) {
            alert("Login failed: " + err.response?.data?.message || "Check your credentials");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" importd />
            <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" importd />
            <button type="submit">Login</button>
        </form>
    );
};