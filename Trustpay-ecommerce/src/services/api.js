// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Updated to match your server port
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;