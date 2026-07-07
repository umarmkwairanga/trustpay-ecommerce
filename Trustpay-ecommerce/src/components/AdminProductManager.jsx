import { useState, useEffect } from 'react';

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) { console.error("Error fetching products:", err); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch('http://localhost:3000/api/products', { method: 'POST', body: formData });
    e.target.reset();
    fetchProducts();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Product Manager</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" placeholder="Product Name" className="border p-2 rounded" required />
        <input name="price" type="number" placeholder="Price" className="border p-2 rounded" required />
        <select name="category" className="border p-2 rounded">
          <option value="Furnitures">Furnitures</option>
          <option value="Electronics">Electronics</option>
          <option value="Others">Others</option>
        </select>
        <input type="file" name="image" className="p-2" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 col-span-full">
          Add Product
        </button>
      </form>

      <ul className="bg-white shadow-md rounded-lg divide-y">
        {products.map(p => (
          <li key={p._id} className="p-4 flex justify-between items-center">
            <span>{p.name} - ${p.price}</span>
            <div className="flex gap-2">
              <button className="text-blue-500">Edit</button>
              <button className="text-red-500">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductManager;