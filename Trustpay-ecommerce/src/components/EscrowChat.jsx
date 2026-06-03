import { useState, useEffect } from "react";
import API from "../services/api";

export default function EscrowChat({ orderId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Poll conversation log for this specific escrow order contract
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/api/chats/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Could not fetch secure conversation log:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchChatHistory();
      // Set up a quick 4-second long-poll intervals to fetch new replies automatically
      const interval = setInterval(fetchChatHistory, 4000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/api/chats",
        { orderId, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Instantly inject message to UI state array
      setMessages([...messages, { ...res.data, sender: { name: "Me" } }]);
      setNewMessage("");
    } catch (err) {
      alert("Failed to deliver secure transmission encrypt packet.");
    }
  };

  return (
    <div className="bg-white border rounded-2xl shadow-md flex flex-col h-[400px]">
      {/* Top Banner Context Header */}
      <div className="bg-[#04153b] text-white p-4 rounded-t-2xl font-bold flex items-center justify-between text-sm">
        <span>🛡️ Protected Escrow Communication Line</span>
        <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></span>
      </div>

      {/* Message Feed Canvas Box */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {loading ? (
          <p className="text-gray-400 text-xs text-center">Opening secure chat keys...</p>
        ) : messages.length === 0 ? (
          <p className="text-gray-400 text-xs text-center py-10">No logs saved. Agree on shipping arrangements securely here.</p>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`flex flex-col ${msg.sender?.name === "Me" ? "items-end" : "items-start"}`}>
              <span className="text-[10px] font-bold text-gray-400 mb-0.5 px-1">{msg.sender?.name}</span>
              <div className={`p-3 rounded-2xl max-w-[75%] text-sm font-medium shadow-sm ${
                msg.sender?.name === "Me" ? "bg-orange-500 text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inputs Form Frame */}
      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2 bg-white rounded-b-2xl">
        <input
          type="text"
          placeholder="Type message regarding delivery parameters..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-orange-500 bg-gray-50"
          required
        />
        <button type="submit" className="bg-[#04153b] text-white font-bold px-5 py-2.5 rounded-xl hover:bg-opacity-90 text-sm transition">
          Send
        </button>
      </form>
    </div>
  );
}