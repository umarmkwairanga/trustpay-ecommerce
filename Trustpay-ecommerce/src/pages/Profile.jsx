import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchMyListings } from '../services/api'; // Add this to your api.js

export default function Profile() {
  const [listings, setListings] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      const { data } = await fetchMyListings();
      setListings(data);
    };
    load();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.result.name}</h1>
      <h2 className="text-xl mb-4">My Listings</h2>
      <div className="grid grid-cols-3 gap-6">
        {listings.map(item => (
          <div key={item._id} className="border p-4 rounded-xl">
            <img src={`http://localhost:5000${item.image}`} alt={item.title} className="w-full h-40 object-cover mb-2" />
            <h3 className="font-bold">{item.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}