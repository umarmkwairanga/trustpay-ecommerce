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
        setError('');
        
        const response = await api.get('/products');
        
        // Safely extract array data regardless of response shape
        let productData = [];
        if (Array.isArray(response.data)) {
          productData = response.data;
        } else if (response.data && Array.isArray(response.data.products)) {
          productData = response.data.products;
        }

        setProducts(productData);
        setFilteredProducts(productData);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Could not connect to the backend marketplace server.');
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle live search filter safely
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (Array.isArray(products)) {
      const filtered = products.filter((p) =>
        p?.name?.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#0B1B3A' }}>
        <h3>Loading TrustPay Marketplace...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ color: '#0B1B3A', margin: 0 }}>TrustPay Marketplace</h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            width: '300px',
            fontSize: '1rem',
          }}
        />
      </div>

      {error && (
        <div style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#fff3cd', color: '#856404', borderRadius: '4px', border: '1px solid #ffeeba' }}>
          {error}
        </div>
      )}

      {/* Strict Array check wrapper to protect .map() */}
      {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
          {filteredProducts.map((product) => (
            <div
              key={product?._id || product?.id || Math.random()}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <img
                  src={product?.image || 'https://via.placeholder.com/200'}
                  alt={product?.name || 'Product'}
                  style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <h3 style={{ fontSize: '1.1rem', color: '#0B1B3A', margin: '0.75rem 0 0.5rem 0' }}>
                  {product?.name || 'Untitled Product'}
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', height: '40px', overflow: 'hidden', margin: 0 }}>
                  {product?.description || 'No description available.'}
                </p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem' }}>
                <span style={{ fontWeight: 'bold', color: '#0B1B3A', fontSize: '1.1rem' }}>
                  ₦{product?.price ? product.price.toLocaleString() : '0'}
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
                  onClick={() => alert(`Initiating Escrow for: ${product?.name}`)}
                >
                  Escrow Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#666', marginTop: '3rem' }}>
          <p style={{ fontSize: '1.1rem' }}>No products found in the marketplace.</p>
          <p style={{ fontSize: '0.9rem', color: '#999' }}>Make sure your backend server is running and seeded with product listings.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;