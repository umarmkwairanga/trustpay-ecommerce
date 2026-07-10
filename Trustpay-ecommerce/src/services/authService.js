import apiClient from './apiClient.js';

export const authService = {
    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    register: async (userData) => {
        return await apiClient.post('/auth/register', userData);
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};