import API from './api.js';

// This function now automatically includes the JWT token via the interceptor
export const updateUserSettings = async (formData) => {
    try {
        const { data } = await API.put('/users/update-settings', formData);
        return data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};