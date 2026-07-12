import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile) setUser(profile);
    }, []);

    const login = (data) => {
        localStorage.setItem('profile', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};