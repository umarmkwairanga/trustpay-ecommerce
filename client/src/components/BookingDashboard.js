import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookingDashboard = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch bookings for the logged-in user
        axios.get('/api/bookings/user/USER_ID_HERE')
            .then(res => setBookings(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookings.map(booking => (
                    <div key={booking._id} className="border p-4 rounded shadow">
                        <h3 className="font-semibold">{booking.type.toUpperCase()}</h3>
                        <p>Status: {booking.status}</p>
                        <p>Date: {new Date(booking.startTime).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingDashboard;