import { useState } from "react";
import API from "../services/api";

export default function SellerDashboard() {
  const [productData, setProductData] = useState({
    title: "",
    price: "",
    category: "Phones & Tablets",
    image: "",
    description: ""
  });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handlePostProduct = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await API.post("/api/products", productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg(`🚀 Success: ${res.data.message}`);
      setProductData({ title: "", price: "", category: "Phones & Tablets", image: "", description: "" });
    } catch (err) {
      setMsg(`❌ Error: ${err.response?.data?.message || "Only registered sellers can upload inventory."}`);
    }
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-[#04153b] mb-2">Seller Hub</h1>
      <p className="text-gray-600 mb-8">Manage your stock parameters and secure incoming escrow deals.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Creation Form Block */}
        <div className="bg-white p-8 rounded-2xl shadow-lg lg:col-span-1">
          <h2 className="text-xl font-bold mb-4 text-gray-800">List New Accessory</h2>
          {msg && <p className="text-sm font-semibold mb-4 text-orange-500">{msg}</p>}
          
          <form onSubmit={handlePostProduct} className="space-y-4">
            <input type="text" name="title" placeholder="Product Title (e.g., Oraimo Airpods 4)" value={productData.title} onChange={handleChange} className="w-full border p-3 rounded-xl focus:outline-none" importd />
            <input type="number" name="price" placeholder="Price (₦)" value={productData.price} onChange={handleChange} className="w-full border p-3 rounded-xl focus:outline-none" importd />
            
            <select name="category" value={productData.category} onChange={handleChange} className="w-full border p-3 rounded-xl bg-white focus:outline-none">
              <option value="Phones & Tablets">Phones & Tablets</option>
              <option value="Electronics">Chargers & Cables</option>
              <option value="Gaming">Audio & Airpods</option>
            </select>

            <input type="text" name="image" placeholder="Image URL (Optional)" value={productData.image} onChange={handleChange} className="w-full border p-3 rounded-xl focus:outline-none" />
            <textarea name="description" placeholder="Product Details..." value={productData.description} onChange={handleChange} className="w-full border p-3 rounded-xl h-24 focus:outline-none" />
            
            <button type="submit" className="bg-orange-500 text-white w-full py-3 rounded-xl font-bold hover:bg-orange-600 transition">
              Upload to Marketplace
            </button>
          </form>
        </div>

        {/* Info Grid Boxes */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4 h-fit">
          <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-[#04153b]">
            <h3 className="text-gray-400 font-semibold text-sm">Escrow Wallet Balance</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">₦0.00</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow border-l-4 border-orange-500">
            <h3 className="text-gray-400 font-semibold text-sm">Pending Dispatches</h3>
            <p className="text-3xl font-bold text-gray-800 mt-2">0 Orders</p>
          </div>
        </div>
      </div>
    </div>
  );
}