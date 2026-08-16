import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await API.post("/api/auth/register", formData);
      alert(res.data.message);
      navigate("/login"); // Redirect user to sign in
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong during sign up.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-[420px]">
        <h1 className="text-4xl font-bold mb-6 text-[#04153b]">Create Account</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleRegister}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="w-full border p-4 rounded-xl mb-4 focus:outline-none" required />
          <input type="email" name="email" placeholder="Email Address" onChange={handleChange} className="w-full border p-4 rounded-xl mb-4 focus:outline-none" required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} className="w-full border p-4 rounded-xl mb-4 focus:outline-none" required />
          
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2 text-gray-600">Join TrustPayEcommerceEcommerce As:</label>
            <select name="role" onChange={handleChange} className="w-full border p-4 rounded-xl bg-white focus:outline-none">
              <option value="buyer">Buyer (Shop Safely via Escrow)</option>
              <option value="seller">Seller (List Products & Earn)</option>
            </select>
          </div>

          <button type="submit" className="bg-orange-500 text-white w-full py-4 rounded-xl font-bold hover:bg-orange-600 transition">
            Register Account
          </button>
        </form>
      </div>
    </div>
  );
}