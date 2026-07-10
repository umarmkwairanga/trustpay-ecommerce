import axios from 'axios';

const API = axios.create({
    // VITE uses import.meta.env instead of process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://axios.get("http:///api/api/products")/api'
});

// Automatically inject the token into every request
// This is your "silent" security guard for every outgoing API call
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

// Added an interceptor for handling 401 errors globally
// If a user's token expires, this will clear their session automatically
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;