import React, { useEffect, useState } from 'react';
import API from '../../services/api';

export default function FreelancerDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/freelancers/profile')
      .then(res => setProfile(res.data.profile))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleVerify = async () => {
    try {
      const res = await API.post('/freelancers/verify');
      alert(`Verification Status: ${res.data.aiResult.status}`);
      setProfile(res.data.profile);
    } catch (err) {
      alert('Verification request failed.');
    }
  };

  if (loading) return <div className="p-6">Loading Freelancer Dashboard...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="bg-[#0B1B3A] text-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{profile?.professionalTitle || 'Freelancer Dashboard'}</h1>
          <p className="text-gray-300">Trust Score: <span className="text-[#FF6A00] font-bold">{profile?.trustScore || 50}/100</span></p>
        </div>
        <button onClick={handleVerify} className="bg-[#FF6A00] text-white px-4 py-2 rounded font-semibold hover:bg-orange-700 transition">
          Run AI Verification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-bold text-gray-700 mb-2">Active Projects</h3>
          <p className="text-3xl font-extrabold text-[#2D7DFF]">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-bold text-gray-700 mb-2">Escrow Balance</h3>
          <p className="text-3xl font-extrabold text-[#1DBF73]">₦0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-bold text-gray-700 mb-2">Completed Projects</h3>
          <p className="text-3xl font-extrabold text-gray-800">{profile?.completedProjectsCount || 0}</p>
        </div>
      </div>
    </div>
  );
}