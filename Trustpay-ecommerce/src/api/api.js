import axios from 'axios';

// Create an Axios instance with your production and development URLs
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://trustpay-ecommerce-1.onrender.com/api'
});

// Request Interceptor: Automatically attach the token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Automatically redirect to login if session expires (401)
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