// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/products')
      .then((response) => {
        console.log("Full data from backend:", response.data); // <--- CHECK THIS IN CONSOLE
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading marketplace...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Trending Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          // IMPORTANT: Check the console log to see if it's 'title', 'name', or 'productName'
          <ProductCard 
            key={p._id} 
            title={p.title || p.name || "No Title"} 
            price={p.price} 
            image={p.image} 
          />
        ))}
      </div>
    </div>
  );
}