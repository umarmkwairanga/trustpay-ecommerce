import React, { useState } from 'react';
import axios from 'axios';

export default function CEOExecutiveAI() {
  const [question, setQuestion] = useState('');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskCEOAssistant = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('/api/ai/executive-assistant', { query: question }, { withCredentials: true });
      setReport(res.data.result || res.data.message);
    } catch (err) {
      setReport('AI executive analyst is currently offline. Platform database analytics remain fully accurate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-[#0B1B3A] mb-2">Ask TrustPay AI — Executive & Business Oversight</h2>
      <p className="text-sm text-gray-600 mb-4">Query platform metrics, revenue streams, active escrow volume, and operational trends using natural language.</p>

      <form onSubmit={handleAskCEOAssistant} className="space-y-4">
        <textarea
          rows="3"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., 'What is our active escrow volume and monthly revenue breakdown?'"
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D7DFF]"
        ></textarea>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2D7DFF] text-white px-6 py-2 rounded font-medium hover:bg-blue-600 transition"
        >
          {loading ? 'Analyzing Platform Data...' : 'Generate Executive Insights'}
        </button>
      </form>

      {report && (
        <div className="mt-6 p-4 bg-[#F7F9FC] border border-blue-100 rounded-md">
          <h3 className="font-bold text-[#0B1B3A] mb-2">Executive Analysis Report:</h3>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{report}</p>
        </div>
      )}
    </div>
  );
}