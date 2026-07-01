import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to backend

const RiderTracking = ({ deliveryId }) => {
  const [status, setStatus] = useState('Assigned');

  // 1. Broadcast location to the buyer in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('riderLocation', { lat: latitude, lng: longitude, deliveryId });
      });
    }, 5000); // Sends location every 5 seconds
    return () => clearInterval(interval);
  }, [deliveryId]);

  // 2. Update status (e.g., Rider clicks "Delivered")
  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/delivery/update/${deliveryId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setStatus(newStatus);
      alert(`Status updated to: ${newStatus}`);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="rider-dashboard">
      <h1>Delivery: #{deliveryId}</h1>
      <p>Current Status: <strong>{status}</strong></p>
      
      <div className="status-buttons">
        <button onClick={() => updateStatus('PickedUp')}>Picked Up</button>
        <button onClick={() => updateStatus('InTransit')}>In Transit</button>
        <button onClick={() => updateStatus('Delivered')}>Confirm Delivery</button>
      </div>
    </div>
  );
};

export default RiderTracking;