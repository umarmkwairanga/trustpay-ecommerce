import React, { useState } from 'react';
import { z } from 'zod';

// Define the validation schema
const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  description: z.string().min(10, "Description must be at least 10 characters")
});

function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    stock: '',
    description: '',
    image: null
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate with Zod
    const result = productSchema.safeParse(formData);
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('description', formData.description);
    data.append('image', formData.image);

    try {
      const response = await fetch('http://axios.get("http:///api/api/products")/api/products', {
        method: 'POST',
        body: data
      });

      if (response.ok) {
        alert("Product added successfully!");
        setFormData({ name: '', price: '', category: '', stock: '', description: '', image: null });
      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h2>
      
      <input name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input name="stock" type="number" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} className="w-full p-2 border rounded" required />
      <textarea name="description" placeholder="Product Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" required />
      <input type="file" onChange={handleFileChange} accept="image/*" className="w-full p-2 border rounded" required />
      
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
      >
        {isLoading ? "Saving..." : "Add Product"}
      </button>
    </form>
  );
}

export default AddProductForm;