import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);

  // This fetches the list of products from your backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', file);

    await axios.post('http://localhost:3000/api/add-product', formData);
    fetchProducts(); // Refresh the list
    alert('Product uploaded!');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>TrustPay Admin Dashboard</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
        <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} required />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} required />
        <button type="submit">Upload</button>
      </form>

      <h2>Storefront (What Buyers See)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
            <img src={p.imageUrl} alt={p.name} style={{ width: '100px' }} />
            <h3>{p.name}</h3>
            <p>${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;