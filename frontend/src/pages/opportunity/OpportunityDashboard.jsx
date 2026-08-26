import React, { useEffect, useState } from 'react';
import API from '../../services/api';

export default function OpportunityDashboard() {
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/opportunities/profile'),
      API.get('/opportunities/recommended')
    ])
      .then(([profileRes, recRes]) => {
        setProfile(profileRes.data.profile);
        setRecommendations(recRes.data.matches || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading Opportunity Engine...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="bg-[#0B1B3A] text-white p-6 rounded-lg shadow-md mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">TrustPay Opportunity Dashboard</h1>
          <p className="text-gray-300 mt-1">Status: <span className="text-[#FF6A00] font-semibold">{profile?.verificationStatus || 'NOT_VERIFIED'}</span></p>
        </div>
        <a href="/opportunities/profile" className="bg-[#FF6A00] text-white px-4 py-2 rounded font-semibold hover:bg-orange-700 transition">
          Edit Opportunity Profile
        </a>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Opportunities For You</h2>
        {recommendations.length === 0 ? (
          <p className="text-gray-500">Complete your profile to receive AI-driven job matches and training recommendations.</p>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="border p-4 rounded-lg flex justify-between items-center bg-[#F7F9FC]">
                <div>
                  <h4 className="font-bold text-lg text-[#0B1B3A]">Match Score: {rec.matchScore}%</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.recommendation}</p>
                </div>
                <button className="bg-[#2D7DFF] text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition">
                  View Job
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}