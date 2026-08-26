import API from './api'; // Your centralized Axios instance

export const flightService = {
  searchFlights: async (params) => {
    const response = await API.get('/flights/search', { params });
    return response.data;
  },
  
  bookFlight: async (bookingData) => {
    const response = await API.post('/flights/book', bookingData);
    return response.data;
  },
  
  getUserBookings: async () => {
    const response = await API.get('/flights/my-bookings');
    return response.data;
  }
};