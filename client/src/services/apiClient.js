import axios from 'axios';

const apiClient = axios.create({
    // Replace with your actual backend URL (e.g., 'http://localhost:3000/api')
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to attach the JWT token to every request
apiClient.interceptors.request.use((config) => {
    // We parse the 'profile' object we set in AuthContext
    const profile = JSON.parse(localStorage.getItem('profile'));
    
    if (profile?.token) {
        config.headers.Authorization = `Bearer ${profile.token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;