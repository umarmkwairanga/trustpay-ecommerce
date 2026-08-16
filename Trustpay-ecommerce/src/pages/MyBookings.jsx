import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchCustomerBookings();
  }, []);

  const fetchCustomerBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmFulfillment = async (bookingId) => {
    if (!window.confirm('Are you sure you want to confirm delivery? This will release the escrow funds to the service provider.')) {
      return;
    }

    setActionLoadingId(bookingId);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/bookings/${bookingId}/confirm-fulfillment`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        alert('Fulfillment confirmed and escrow released successfully!');
        fetchCustomerBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to confirm fulfillment.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Confirmed: 'bg-blue-100 text-[#2D7DFF]',
      Completed: 'bg-green-100 text-[#1DBF73]',
      Cancelled: 'bg-red-100 text-red-800',
      Disputed: 'bg-orange-100 text-[#FF6A00]'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-6 text-center text-[#0B1B3A]">Loading your bookings...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-[#F7F9FC] min-h-screen">
      <h1 className="text-3xl font-bold text-[#0B1B3A] mb-6">My Bookings & Reservations</h1>
      
      {bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center">
          <p className="text-gray-600 mb-4">You have not made any bookings yet.</p>
          <a href="/search" className="bg-[#FF6A00] text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-90">
            Explore Bookable Services
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const isSubmitting = actionLoadingId === booking._id;
            const canReleaseEscrow = booking.status === 'Confirmed' && booking.escrowStatus !== 'released';

            return (
              <div key={booking._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-gray-500">Ref: {booking.bookingReference}</span>
                    {getStatusBadge(booking.status)}
                  </div>
                  <h3 className="text-xl font-bold text-[#0B1B3A]">{booking.bookingItem?.title || 'Bookable Item'}</h3>
                  <p className="text-gray-600 text-sm mt-1">Provider: <span className="font-medium">{booking.business?.businessName}</span></p>
                  <p className="text-gray-500 text-xs mt-1">
                    Schedule: {new Date(booking.schedule?.startDate).toLocaleDateString()} {booking.schedule?.timeSlot && `| Time: ${booking.schedule.timeSlot}`}
                  </p>
                </div>
                
                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-lg font-bold text-[#FF6A00]">
                    ₦{booking.pricingDetails?.totalAmount?.toLocaleString()}
                  </div>
                  <p className="text-xs text-gray-400">Includes 5% TrustPay Fee</p>
                  <span className="inline-block text-xs font-semibold px-2 py-1 bg-gray-100 text-[#0B1B3A] rounded">
                    Escrow: <strong className="uppercase">{booking.escrowStatus}</strong>
                  </span>

                  {canReleaseEscrow && (
                    <button 
                      onClick={() => handleConfirmFulfillment(booking._id)}
                      disabled={isSubmitting}
                      className="mt-2 bg-[#1DBF73] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-opacity-90 transition disabled:opacity-50"
                    >
                      {isSubmitting ? 'Releasing...' : 'Confirm Delivery & Release Escrow'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}