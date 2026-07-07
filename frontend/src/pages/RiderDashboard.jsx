import React, { useEffect, useState, useRef } from 'react';
import API from '../api';
import io from 'socket.io-client';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default Leaflet marker icon
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const socket = io('http://axios.get("http://http://localhost:5000/api/products")'); 

const LiveMap = ({ lat, lng }) => (
  <MapContainer center={[lat, lng]} zoom={15} style={{ height: "200px", width: "100%" }}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[lat, lng]} />
  </MapContainer>
);

const RiderDashboard = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [proofs, setProofs] = useState({});
  const [isOnline, setIsOnline] = useState(false);
  const [currentPos, setCurrentPos] = useState({ lat: 9.23, lng: 12.45 });
  const watchId = useRef(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const res = await API.get('/orders');
        setDeliveries(res.data.filter(o => o.status === 'shipped'));
      } catch (err) { console.error("Error fetching deliveries:", err); }
      finally { setLoading(false); }
    };
    fetchDeliveries();
  }, []);

  useEffect(() => {
    if (isOnline && navigator.geolocation) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentPos({ lat: latitude, lng: longitude });
          socket.emit('update-rider-location', { lat: latitude, lng: longitude, orderId: 'active-delivery' });
        },
        (err) => console.error("GPS Error:", err),
        { enableHighAccuracy: true }
      );
    } else {
      navigator.geolocation.clearWatch(watchId.current);
    }
    return () => navigator.geolocation.clearWatch(watchId.current);
  }, [isOnline]);

  const markAsDelivered = async (orderId) => {
    if (!proofs[orderId]) return alert("Please upload a photo of the delivery proof.");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('status', 'delivered');
      formData.append('deliveryProof', proofs[orderId]);
      await API.patch(`/orders/${orderId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Delivery confirmed!");
      setDeliveries(prev => prev.filter(d => d._id !== orderId));
    } catch (err) { alert("Error confirming delivery. Please try again."); }
    finally { setUploading(false); }
  };

  const reportFailedDelivery = async (orderId) => {
    const reason = prompt("Enter reason for failed delivery:");
    if (!reason) return;
    try {
      await API.patch(`/orders/${orderId}`, { status: 'shipped', note: `Failed: ${reason}` });
      alert("Failure reported to support.");
    } catch (err) { alert("Error reporting failure."); }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-navy">Rider Delivery Portal</h2>
      
      {/* GPS Status Toggle */}
      <div className="bg-white p-4 mb-6 shadow rounded flex justify-between items-center">
        <span className="font-semibold">GPS Status: 
            <span className={isOnline ? "text-green-600 ml-2" : "text-red-600 ml-2"}>{isOnline ? 'Online' : 'Offline'}</span>
        </span>
        <button onClick={() => setIsOnline(!isOnline)} className={`px-4 py-2 rounded text-white ${isOnline ? "bg-red-500" : "bg-green-600"}`}>
          {isOnline ? 'Go Offline' : 'Go Online'}
        </button>
      </div>
      
      {loading ? <p>Loading delivery tasks...</p> : (
        <div className="grid gap-6">
          {deliveries.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 border-2 border-dashed rounded text-gray-500">
              No pending deliveries at this time.
            </div>
          ) : (
            deliveries.map(order => (
              <div key={order._id} className="bg-white p-6 rounded shadow border">
                <p className="font-bold text-lg mb-2">Order: #{order._id.slice(-6)}</p>
                <div className="my-4 rounded overflow-hidden border">
                  <LiveMap lat={currentPos.lat} lng={currentPos.lng} />
                </div>
                <input 
                    type="file" 
                    onChange={(e) => setProofs({...proofs, [order._id]: e.target.files[0]})} 
                    className="my-3 w-full text-sm" 
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => markAsDelivered(order._id)} disabled={uploading} className="bg-blue-600 hover:bg-blue-700 text-white flex-1 py-2 rounded transition">
                    {uploading ? 'Processing...' : 'Confirm Delivery'}
                  </button>
                  <button onClick={() => reportFailedDelivery(order._id)} className="bg-gray-500 hover:bg-gray-600 text-white flex-1 py-2 rounded transition">
                    Failed
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RiderDashboard;