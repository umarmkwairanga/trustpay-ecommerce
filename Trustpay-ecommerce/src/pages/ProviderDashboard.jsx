import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [bookingRes, inventoryRes] = await Promise.all([
        axios.get('/api/provider/bookings', { headers }),
        axios.get('/api/business/inventory', { headers })
      ]);

      if (bookingRes.data.success) setBookings(bookingRes.data.bookings);
      if (inventoryRes.data.success) setInventory(inventoryRes.data.items);
    } catch (err) {
      console.error('Error loading provider data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/provider/bookings/${bookingId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProviderData(); // Refresh list
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  if (loading) return <div className="p-6 text-center text-[#0B1B3A]">Loading Provider Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-[#F7F9FC] min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#0B1B3A]">Business Provider Dashboard</h1>
        <div className="space-x-3">
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'bookings' ? 'bg-[#FF6A00] text-white' : 'bg-white text-[#0B1B3A]'}`}
          >
            Client Bookings ({bookings.length})
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'inventory' ? 'bg-[#FF6A00] text-white' : 'bg-white text-[#0B1B3A]'}`}
          >
            Manage Inventory ({inventory.length})
          </button>
        </div>
      </div>

      {activeTab === 'bookings' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B1B3A] mb-4">Incoming Reservation Requests</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 bg-white p-6 rounded-xl">No booking requests found.</p>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-xs font-bold text-gray-500">Ref: {b.bookingReference}</span>
                  <h3 className="text-lg font-bold text-[#0B1B3A]">{b.bookingItem?.title}</h3>
                  <p className="text-sm text-gray-600">Customer: <span className="font-semibold">{b.customer?.name}</span> ({b.customer?.email})</p>
                  <p className="text-xs text-gray-500">Date: {new Date(b.schedule?.startDate).toLocaleDateString()}</p>
                  <p className="text-sm font-semibold text-[#FF6A00] mt-1">Status: {b.status}</p>
                </div>
                <div className="flex gap-2">
                  {b.status === 'Pending' && (
                    <>
                      <button onClick={() => handleUpdateStatus(b._id, 'Confirmed')} className="bg-[#1DBF73] text-white px-4 py-2 rounded-lg text-sm font-medium">Accept</button>
                      <button onClick={() => handleUpdateStatus(b._id, 'Cancelled')} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Reject</button>
                    </>
                  )}
                  {b.status === 'Confirmed' && (
                    <button onClick={() => handleUpdateStatus(b._id, 'Completed')} className="bg-[#2D7DFF] text-white px-4 py-2 rounded-lg text-sm font-medium">Mark Completed</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#0B1B3A] mb-4">Your Bookable Inventory</h2>
          {inventory.length === 0 ? (
            <p className="text-gray-500 bg-white p-6 rounded-xl">You have no inventory listed yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {inventory.map((item) => (
                <div key={item._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-xs uppercase font-bold text-[#2D7DFF]">{item.category}</span>
                  <h3 className="text-lg font-bold text-[#0B1B3A] mt-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-[#FF6A00]">₦{item.pricing?.basePrice?.toLocaleString()}</span>
                    <span className={`text-xs px-2 py-1 rounded ${item.availabilityRules?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {item.availabilityRules?.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}