import { useEffect, useState } from "react";
import API from "../services/api";
import EscrowChat from "../components/EscrowChat"; // <-- Import our chat box

export default function BuyerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeChatOrderId, setActiveChatOrderId] = useState(null); // Track which order chat is open

  useEffect(() => {
    const fetchMyEscrowOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/orders/my-orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(res.data);
        if(res.data.length > 0) {
          setActiveChatOrderId(res.data[0]._id); // Autofocus first contract chat row
        }
      } catch (err) {
        console.error("Error pulling buyer contracts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEscrowOrders();
  }, []);

  const handleConfirmDelivery = async (reference) => {
    if (!window.confirm("Are you sure you have received your phone accessory? This releases the held funds permanently to the seller.")) return;
    
    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post("/orders/verify", { reference }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("💥 Delivery Confirmed! Escrow milestone cleared and funds released.");
      setOrders(orders.map(o => o.reference === reference ? { ...o, status: "Secured in Escrow" } : o));
    } catch (err) {
      alert(err.response?.data?.message || "Verification processing failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#04153b] mb-2">My Protection Dashboard</h1>
        <p className="text-gray-600 mb-8">Track your secured funds, communicate with vendors, and clear escrow milestones.</p>

        {loading ? (
          <p className="text-gray-500 font-medium">Querying secure ledger accounts...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl text-center shadow">
            <p className="text-gray-500 font-medium">You haven't initiated any secure escrow purchases yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left/Middle Column: Order Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden self-start">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#04153b] text-white">
                    <th className="p-4 font-semibold text-xs uppercase">Contract Code</th>
                    <th className="p-4 font-semibold text-xs uppercase">Item</th>
                    <th className="p-4 font-semibold text-xs uppercase">Amount Locked</th>
                    <th className="p-4 font-semibold text-xs uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr 
                      key={order._id} 
                      onClick={() => setActiveChatOrderId(order._id)}
                      className={`border-b last:border-0 cursor-pointer transition ${
                        activeChatOrderId === order._id ? "bg-orange-50 font-medium" : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-4 font-mono font-bold text-orange-600">{order.reference}</td>
                      <td className="p-4 text-gray-800 text-sm">{order.product?.title || "Accessory Item"}</td>
                      <td className="p-4 font-semibold text-gray-700 text-sm">₦{Number(order.amount).toLocaleString()}</td>
                      <td className="p-4 text-center">
                        {order.status === "Awaiting Payment" ? (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering row chat switch
                              handleConfirmDelivery(order.reference);
                            }}
                            disabled={actionLoading}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition"
                          >
                            Verify Transfer
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700">
                            Secured 🔒
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right Column: Escrow Live Communication Panel */}
            <div className="lg:col-span-1">
              {activeChatOrderId ? (
                <EscrowChat orderId={activeChatOrderId} />
              ) : (
                <div className="bg-white border rounded-2xl p-6 text-center text-gray-400 text-sm shadow-sm">
                  Select a contract row code to open the protected chat feed.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}