import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookingSearch() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Track inputs per item ID to avoid shared state bugs across cards
  const [bookingInputs, setBookingInputs] = useState({});
  const [bookingLoadingId, setBookingLoadingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [category]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bookings/search', {
        params: { category, keyword: searchQuery }
      });
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (err) {
      console.error('Failed to fetch search results', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInventory();
  };

  const handleInputChange = (itemId, field, value) => {
    setBookingInputs(prev => ({
      ...prev,
      [itemId]: {
        startDate: '',
        guests: 1,
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleInitiateBooking = async (item) => {
    const itemInput = bookingInputs[item._id] || {};
    const startDate = itemInput.startDate;
    const guests = itemInput.guests || 1;

    if (!startDate) {
      alert('Please select a reservation date first.');
      return;
    }

    setBookingLoadingId(item._id);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/bookings/initiate', {
        bookingItemId: item._id,
        schedule: { startDate },
        pricingDetails: { guestsCount: Number(guests) }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert('Booking initiated successfully! Redirecting to payment...');
        if (response.data.paymentUrl) {
          window.location.href = response.data.paymentUrl;
        } else {
          window.location.href = '/my-bookings';
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initiate booking.');
    } finally {
      setBookingLoadingId(null);
    }
  };

  const categories = [
    { label: 'All Services', value: '' },
    { label: 'Flights', value: 'flight' },
    { label: 'Restaurants', value: 'restaurant' },
    { label: 'Transport', value: 'transport' },
    { label: 'Hotels', value: 'hotel' },
    { label: 'Car Rental', value: 'car_rental' },
    { label: 'Events', value: 'event' },
    { label: 'Appointments', value: 'appointment' },
    { label: 'Professional Services', value: 'professional_service' },
    { label: 'Other', value: 'other' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#F7F9FC] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0B1B3A] mb-2">Explore & Book Services</h1>
      <p className="text-gray-600 mb-6">Secure escrow booking for hotels, flights, dining, transport, and more.</p>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search by title, location, or keyword..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6A00]"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border border-gray-200 rounded-lg bg-white text-[#0B1B3A] focus:outline-none focus:border-[#FF6A00]"
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <button type="submit" className="bg-[#FF6A00] text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90">
          Search
        </button>
      </form>

      {/* Results Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#0B1B3A]">Loading available services...</div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl shadow-sm">
          <p className="text-gray-500">No bookable services found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const currentInput = bookingInputs[item._id] || { startDate: '', guests: 1 };
            const isSubmitting = bookingLoadingId === item._id;

            return (
              <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="bg-gray-100 h-48 flex items-center justify-center text-gray-400 overflow-hidden">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>No Image Available</span>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-xs uppercase font-bold text-[#2D7DFF] bg-blue-50 px-2 py-1 rounded">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-[#0B1B3A] mt-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-xl font-bold text-[#FF6A00]">
                        ₦{item.pricing?.basePrice?.toLocaleString()} <span className="text-xs text-gray-400 font-normal">({item.pricing?.unit})</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Action Box */}
                <div className="p-5 bg-gray-50 border-t border-gray-100">
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Reservation Date</label>
                      <input 
                        type="date" 
                        value={currentInput.startDate}
                        onChange={(e) => handleInputChange(item._id, 'startDate', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Guests / Units</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={item.capacity?.maxGuests || 10}
                        value={currentInput.guests}
                        onChange={(e) => handleInputChange(item._id, 'guests', e.target.value)}
                        className="w-full p-2 border border-gray-200 rounded text-sm bg-white"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => handleInitiateBooking(item)}
                    disabled={isSubmitting}
                    className="w-full bg-[#1DBF73] text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Book & Pay Securely'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}