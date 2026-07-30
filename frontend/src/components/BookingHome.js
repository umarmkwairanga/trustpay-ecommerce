// frontend/src/components/BookingHome.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { name: 'Flights', icon: '✈️', path: '/bookings/flights' },
  { name: 'Hotels', icon: '🏨', path: '/bookings/hotels' },
  { name: 'Transport', icon: '🚗', path: '/bookings/transport' },
  { name: 'Ride', icon: '🚕', path: '/bookings/ride' },
  { name: 'Food', icon: '🍔', path: '/bookings/food' },
  { name: 'Events', icon: '🎟️', path: '/bookings/events' },
];

const BookingHome = () => {
  const navigate = useNavigate();

  return (
    <div className="booking-grid">
      {services.map((service) => (
        <div key={service.name} className="service-card" onClick={() => navigate(service.path)}>
          <span>{service.icon}</span>
          <h3>{service.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default BookingHome;