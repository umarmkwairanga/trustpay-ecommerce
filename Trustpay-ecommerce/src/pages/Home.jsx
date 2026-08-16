// src/pages/Home.jsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import API from "../services/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplaceProducts = async () => {
      try {
        const res = await API.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error pulling live catalog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketplaceProducts();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar removed from here to prevent duplication */}
      <div className="flex gap-5 p-5">
        <Sidebar />
        <div className="flex-1">
          <Hero />
          
          <h2 className="text-2xl font-bold text-[#04153b] mt-8 mb-4">Trending Escrow Listings</h2>
          
          {loading ? (
            <p className="text-gray-500 font-medium">Loading TrustPayEcommerceEcommerce Marketplace Catalogue...</p>
          ) : products.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center shadow">
              <p className="text-gray-500">No active products found in the database.</p>
              <p className="text-sm text-orange-500 mt-1">Log in as a Seller to add the first inventory item!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  title={product.title}
                  price={`₦${Number(product.price).toLocaleString()}`}
                  image={product.image}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}