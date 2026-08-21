import React, { useState } from 'react';
import { flightService } from '../services/flightService';

export default function FlightBooking() {
  const [searchParams, setSearchParams] = useState({
    departureAirport: '',
    arrivalAirport: '',
    date: '',
    classType: 'Economy'
  });

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle input changes for search
  const handleChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  // Search for flights
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await flightService.searchFlights(searchParams);
      setFlights(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch flights');
    } finally {
      setLoading(false);
    }
  };

  // Book a flight
  const handleBookFlight = async (flightId) => {
    try {
      const bookingData = {
        flightId,
        passengers: [
          { fullName: 'Test Passenger', seatNumber: '12A' } // Example passenger data
        ]
      };
      
      const response = await flightService.bookFlight(bookingData);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search & Book Flights (Escrow Secured)</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      {successMessage && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">{successMessage}</div>}

      {/* Search Form */}
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded shadow">
        <input 
          type="text" 
          name="departureAirport" 
          placeholder="From (e.g. LOS)" 
          value={searchParams.departureAirport} 
          onChange={handleChange} 
          className="p-2 border rounded"
        />
        <input 
          type="text" 
          name="arrivalAirport" 
          placeholder="To (e.g. ABV)" 
          value={searchParams.arrivalAirport} 
          onChange={handleChange} 
          className="p-2 border rounded"
        />
        <input 
          type="date" 
          name="date" 
          value={searchParams.date} 
          onChange={handleChange} 
          className="p-2 border rounded"
        />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {loading ? 'Searching...' : 'Search Flights'}
        </button>
      </form>

      {/* Flight Results List */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight._id} className="border p-4 rounded shadow flex justify-between items-center bg-white">
            <div>
              <h3 className="font-bold text-lg">{flight.airline} - {flight.flightNumber}</h3>
              <p className="text-gray-600">{flight.departureAirport} ➔ {flight.arrivalAirport}</p>
              <p className="text-sm text-gray-500">Class: {flight.classType} | Available Seats: {flight.availableSeats}</p>
              <p className="font-semibold text-blue-600 mt-1">₦{flight.price.toLocaleString()}</p>
            </div>
            <button 
              onClick={() => handleBookFlight(flight._id)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Book via Escrow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}