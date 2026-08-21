import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Calls http://localhost:5000/api/products via your api.js service
        const response = await api.get('/products');
        
        // Ensure data returned is an array
        const productData = Array.isArray(response.data) ? response.data : response.data.products || [];
        setProducts(productData);
        setFilteredProducts(productData);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please check if the backend server is running.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search filter safely
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (Array.isArray(products)) {
      const filtered = products.filter((p) =>
        p.name?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#0B1B3A' }}>
        <h3>Loading TrustPay Marketplace...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#FF6A00' }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#0B1B3A' }}>TrustPay Marketplace</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '300px',
          }}
        />
      </div>

      {/* Safe check using Array.isArray to prevent .map crash */}
      {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map((product) => (
            <div
              key={product._id || product.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              }}
            >
              <img
                src={product.image || 'https://via.placeholder.com/200'}
                alt={product.name}
                style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
              />
              <h3 style={{ fontSize: '1.1rem', color: '#0B1B3A', margin: '0.5rem 0' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden' }}>
                {product.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontWeight: 'bold', color: '#0B1B3A', fontSize: '1.1rem' }}>
                  ₦{product.price?.toLocaleString()}
                </span>
                <button
                  style={{
                    backgroundColor: '#FF6A00',
                    color: '#fff',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  Escrow Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>No products found in the marketplace yet.</p>
      )}
    </div>
  );
};

export default ProductList;