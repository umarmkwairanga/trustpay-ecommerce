import React, { useState, useEffect } from 'react';

function ProductMarketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 1. PLACE STATE HERE
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/products/approved')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching marketplace items:", err);
        setLoading(false);
      });
  }, []);

  // 2. PLACE FILTER LOGIC HERE
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Marketplace</h1>
      
      {/* 3. PLACE INPUT FIELD HERE */}
      <input 
        type="text" 
        placeholder="Search products..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ marginBottom: '20px', padding: '8px', width: '250px' }}
      />

      {loading ? (
        <p>Loading available products...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products match your search.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* 4. MAP THROUGH filteredProducts INSTEAD OF products */}
          {filteredProducts.map((p) => (
            <div key={p._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
              <h3>{p.name}</h3>
              <p>Price: ${p.price}</p>
              <button>Buy Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductMarketplace;