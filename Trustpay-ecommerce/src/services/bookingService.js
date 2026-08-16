import API from './api';

export const bookingService = {
  // Search available service providers/items
  searchBookings: async (searchParams) => {
    const response = await API.get('/customer/bookings/search', { params: searchParams });
    return response.data;
  },

  // Get current user's bookings
  getMyBookings: async () => {
    const response = await API.get('/customer/bookings/my-bookings');
    return response.data;
  },

  // Provider dashboard data
  getProviderDashboard: async () => {
    const response = await API.get('/provider/dashboard');
    return response.data;
  },
};