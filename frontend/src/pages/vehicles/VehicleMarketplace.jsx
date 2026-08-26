import React, { useEffect, useState } from 'react';
import API from '../../services/api';

export default function VehicleMarketplace() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    const url = typeFilter ? `/vehicles?vehicleType=${typeFilter}` : '/vehicles';
    API.get(url)
      .then(res => setVehicles(res.data.vehicles || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [typeFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="bg-[#0B1B3A] text-white p-8 rounded-lg shadow-md mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">TrustPay Vehicles Marketplace</h1>
          <p className="text-gray-300 mt-2">Secure escrow-protected purchases for Cars, Motorcycles, Trucks, and Buses.</p>
        </div>
        <a href="/vehicles/create" className="bg-[#FF6A00] text-white px-5 py-2.5 rounded font-semibold hover:bg-orange-700 transition">
          List a Vehicle
        </a>
      </div>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {['', 'car', 'motorcycle', 'truck', 'bus', 'commercial'].map(type => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium uppercase text-sm ${typeFilter === type ? 'bg-[#FF6A00] text-white' : 'bg-white border text-gray-700 hover:bg-gray-100'}`}
          >
            {type || 'All Vehicles'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading verified vehicle listings...</div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border text-gray-500">No vehicles available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <div key={v._id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-gray-200 relative">
                {v.images?.[0] ? (
                  <img src={v.images[0]} alt={v.model} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 font-medium">No Image Available</div>
                )}
                <span className="absolute top-3 left-3 bg-[#0B1B3A] text-white text-xs px-2.5 py-1 rounded font-semibold uppercase">
                  {v.condition}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-[#0B1B3A]">{v.year} {v.make} {v.model}</h3>
                <p className="text-xl font-extrabold text-[#FF6A00] mt-1">₦{v.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">📍 {v.location} • ⚙️ {v.transmission}</p>
                <a href={`/vehicles/${v._id}`} className="mt-4 block w-full text-center bg-[#2D7DFF] text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
                  View Details & Escrow
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}