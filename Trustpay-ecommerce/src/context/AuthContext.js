import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile) {
            setUser(profile);
            // Set the default Authorization header for all future axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${profile.token}`;
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        // Data expected: { _id, username, email, role, token }
        localStorage.setItem('profile', JSON.stringify(data));
        setUser(data);
        // Set the token globally for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        // Remove the header on logout
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};