import React, { useState } from 'react';
import axios from 'axios';

const TranslationDashboard = () => {
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/translation/translate',
        { text, targetLanguage: 'English' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTranslated(response.data.translatedText);
    } catch (err) {
      console.error("Translation failed:", err);
      alert('Translation failed. Please check your connection or login status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Source Pane */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Input Text (Nigerian Language)</label>
        <textarea 
          className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button 
          onClick={handleTranslate}
          disabled={loading}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {/* Result Pane */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Real-time Translation</label>
        <div className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-y-auto">
          {translated || <span className="text-gray-400 italic">Translation will appear here...</span>}
        </div>
      </div>
    </div>
  );
};

export default TranslationDashboard;