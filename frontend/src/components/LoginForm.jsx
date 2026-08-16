import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
            // Assuming your backend sends back { token: "..." }
            localStorage.setItem('token', response.data.token);
            alert("Login Successful! Token saved.");
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.message || "Check your credentials"));
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login to TrustPayEcommerceEcommerceEcommerce</h2>
            <input 
                type="email" placeholder="Email" 
                onChange={(e) => setCredentials({...credentials, email: e.target.value})} 
            />
            <input 
                type="password" placeholder="Password" 
                onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;