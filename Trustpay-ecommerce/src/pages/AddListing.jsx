import React, { useState } from 'react';
import { createListing } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AddListing() {
  const [formData, setFormData] = useState({ title: '', description: '', kind: 'furniture', image: null });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('kind', formData.kind);
    data.append('image', formData.image); // The actual file object

    try {
      await createListing(data);
      alert('Listing created successfully!');
      navigate('/');
    } catch (err) {
      alert('Error creating listing');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>
        
        <input className="w-full border p-4 rounded-xl mb-4" placeholder="Title" onChange={(e) => setFormData({...formData, title: e.target.value})} />
        
        <select className="w-full border p-4 rounded-xl mb-4" onChange={(e) => setFormData({...formData, kind: e.target.value})}>
          <option value="furniture">Furniture</option>
          <option value="vehicle">Vehicle</option>
          <option value="realEstate">Real Estate</option>
        </select>

        <textarea className="w-full border p-4 rounded-xl mb-4" placeholder="Description" onChange={(e) => setFormData({...formData, description: e.target.value})} />
        
        <input type="file" className="mb-6" onChange={(e) => setFormData({...formData, image: e.target.files[0]})} />
        
        <button className="bg-orange-500 text-white w-full py-4 rounded-xl font-semibold">Submit Listing</button>
      </form>
    </div>
  );
}