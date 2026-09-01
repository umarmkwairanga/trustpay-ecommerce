import React, { useState } from 'react';
import axios from 'axios';

export default function ShopWithAI() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = query;
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/buyer-assistant', { query: userMessage }, { withCredentials: true });
      const aiResponse = res.data.result || res.data.message;
      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'AI assistant is temporarily unavailable. Standard search and browse functions remain fully active.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center space-x-2 mb-4 border-b pb-3">
        <span className="text-2xl">🤖</span>
        <h2 className="text-xl font-bold text-[#0B1B3A]">Shop with TrustPay AI</h2>
      </div>

      <div className="h-96 overflow-y-auto p-4 bg-[#F7F9FC] rounded-md mb-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-32">Ask me anything! e.g., "Find me a phone under ₦200,000" or "Explain used product inspection."</p>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-[#FF6A00] text-white' : 'bg-white text-[#0B1B3A] border border-gray-200 shadow-sm'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm italic">TrustPay AI is thinking...</div>}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask TrustPay AI for product recommendations or assistance..."
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF6A00]"
        />
        <button
          type="submit"
          className="bg-[#0B1B3A] text-white px-6 py-2 rounded-md font-medium hover:bg-opacity-90 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}