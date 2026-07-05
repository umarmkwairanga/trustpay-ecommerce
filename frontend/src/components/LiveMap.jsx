import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';

const socket = io('http://localhost:3000'); // Your backend URL

const LiveMap = ({ orderId }) => {
  const [position, setPosition] = useState([9.23, 12.45]); // Default location

  useEffect(() => {
    // Listen for location updates from the rider
    socket.on(`location-update-${orderId}`, (data) => {
      setPosition([data.lat, data.lng]);
    });
  }, [orderId]);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position} />
    </MapContainer>
  );
};

export default LiveMap;