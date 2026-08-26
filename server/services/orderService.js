import apiClient from './apiClient.js';

export const orderService = {
    createOrder: async (orderData) => {
        const response = await apiClient.post('/orders', orderData);
        return response.data;
    },
    // You can add more methods later, like:
    // getUserOrders: () => apiClient.get('/orders/my-orders'),
};