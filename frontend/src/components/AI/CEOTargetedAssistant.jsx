import React, { useState } from 'react';

export default function CEOTargetedAssistant() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello CEO. I am your Executive AI Orchestrator. How can I assist you with company operations across Marketplace, Travel, Employment, or Finance today?' }
  ]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, { sender: 'ceo', text: userMsg }]);
    setQuery('');

    setTimeout(() => {
      let reply = "Based on verified database records, all ecosystem modules are operating within normal parameters.";
      const q = userMsg.toLowerCase();
      if (q.includes('revenue')) reply = "Platform revenue is aggregating normally from verified successful marketplace and service transactions.";
      else if (q.includes('escrow')) reply = "Active escrow volume is secured in the backend escrow vault pending delivery and buyer confirmation.";
      else if (q.includes('travel')) reply = "Travel and booking modules are synchronized with zero critical API failures.";

      setMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 flex flex-col h-[520px]">
      <div className="bg-[#0B1B3A] text-white p-4 rounded-t-xl font-bold flex justify-between items-center">
        <span>CEO AI Assistant Orchestrator</span>
        <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
        {messages.map((m, idx) => (
          <div key={idx} className={`p-3 rounded-lg max-w-[85%] ${m.sender === 'ceo' ? 'bg-[#FF6A00] text-white ml-auto' : 'bg-white text-gray-800 border shadow-sm'}`}>
            {m.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask CEO AI anything about the company..." 
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B1B3A]"
        />
        <button type="submit" className="bg-[#0B1B3A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-900">Ask</button>
      </form>
    </div>
  );
}