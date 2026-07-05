import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/auth/register', formData);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (error) {
            alert("Registration failed: " + (error.response?.data?.message || "Check your details"));
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Create an Account</h2>
            <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Register;