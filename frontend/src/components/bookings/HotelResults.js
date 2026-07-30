// frontend/src/components/bookings/HotelResults.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HotelResults = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    // We filter by 'hotel' serviceType
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/partners?serviceType=hotel');
        setHotels(response.data);
      } catch (err) {
        console.error("Error fetching hotels:", err);
      }
    };
    fetchHotels();
  }, []);

  return (
    <div className="results-container">
      <h2>Available Hotels</h2>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            <h3>{hotel.businessName}</h3>
            <p>Location: {hotel.location}</p>
            <button onClick={() => alert(`Booking flow for ${hotel.businessName} starts here!`)}>
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelResults;