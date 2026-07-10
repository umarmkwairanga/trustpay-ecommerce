import axios from 'axios';

// 1. Create an instance with your base URL
const api = axios.create({
    baseURL: 'http://localhost:3000/api', 
});

// 2. The Interceptor: Automatically attaches the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Retrieve token from browser storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;