import React, { useState } from 'react';
import API from '../api';
import BankLinker from '../components/BankLinker';
import SalesOverview from '../components/SalesOverview';

const SellerDashboard = () => {
  const [details, setDetails] = useState('');
  const [aiDescription, setAiDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAI = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/ai/generate-description', { productDetails: details });
      setAiDescription(data.description);
    } catch (err) {
      alert("AI Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#001F5B' }}>
        Seller Genius Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Operations */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <SalesOverview />
          </div>
        </div>

        {/* Right Column: AI & Infrastructure */}
        <div className="space-y-8">
          {/* Seller Genius AI */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#001F5B' }}>
              Seller Genius AI
            </h2>
            <textarea 
              className="w-full p-2 border rounded"
              placeholder="Describe your product (e.g., Luxury leather belt...)"
              onChange={(e) => setDetails(e.target.value)}
              style={{ borderColor: '#E5E7EB' }}
            />
            <button onClick={generateAI} className="btn-primary mt-4 w-full">
              {loading ? 'Generating...' : 'Create Listing with AI'}
            </button>
            {aiDescription && (
              <div className="mt-6 p-4 rounded border bg-gray-50">
                <h4 className="font-bold" style={{ color: '#001F5B' }}>AI Generated:</h4>
                <p className="mt-2 text-sm">{aiDescription}</p>
              </div>
            )}
          </div>

          {/* Infrastructure */}
          <div className="card">
            <BankLinker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;