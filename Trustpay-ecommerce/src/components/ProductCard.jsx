import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ProductCard({ id, image, title, price }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEscrowPurchase = async () => {
    const token = localStorage.getItem("token");
    
    // Safety check: If not logged in, boot them to login
    if (!token) {
      alert("Please login or create an account to secure items via TrustPayEcommerceEcommerce Escrow.");
      return navigate("/login");
    }

    setLoading(true);
    try {
      // Hit our newly mounted backend order router
      const res = await API.post(
        "/api/orders/initiate",
        { productId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`🛡️ Escrow Contract Initialized!\nReference: ${res.data.order.reference}`);
      
      // Redirect buyer directly to their tracking dashboard
      navigate("/buyer-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Could not process escrow initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg hover:scale-105 transition duration-300">
      <img src={image} className="w-full h-[200px] object-cover rounded-lg" alt={title} />
      <h2 className="mt-4 font-bold text-gray-800">{title}</h2>
      <p className="text-orange-500 font-bold mt-2">{price}</p>
      
      <button 
        onClick={handleEscrowPurchase}
        disabled={loading}
        className="bg-[#04153b] text-white w-full py-3 rounded-lg mt-4 hover:bg-opacity-90 transition font-semibold"
      >
        {loading ? "Securing Contract..." : "Buy via Escrow"}
      </button>
    </div>
  );
}