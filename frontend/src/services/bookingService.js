import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings'; // Adjust your port if needed

export const createBooking = async (bookingData) => {
    try {
        const response = await axios.post(`${API_URL}/create`, bookingData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to create booking";
    }
};

export const fetchUserBookings = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch bookings";
    }
};