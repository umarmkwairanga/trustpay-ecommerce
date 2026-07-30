import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Groceries', 'Automotive'];

const AddProductPage = () => {
    const [product, setProduct] = useState({ 
        name: '', 
        price: '', 
        description: '', 
        category: '' 
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGenerateDescription = async () => {
        if (!product.name) return alert("Please enter a product name first.");
        setLoading(true);
        try {
            const response = await api.post('/ai/generate-description', { 
                productDetails: `Generate a short product description for: ${product.name}` 
            });
            setProduct({ ...product, description: response.data.description });
        } catch (error) {
            alert("AI generation failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.category) return alert("Please select a category.");
        try {
            await api.post('/admin/products', product);
            alert("Product added successfully!");
            navigate('/admin/products');
        } catch (error) {
            alert("Failed to add product.");
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                    type="text" 
                    placeholder="Product Name" 
                    className="w-full p-2 border rounded"
                    onChange={(e) => setProduct({...product, name: e.target.value})} 
                    required 
                />
                <input 
                    type="number" 
                    placeholder="Price" 
                    className="w-full p-2 border rounded"
                    onChange={(e) => setProduct({...product, price: e.target.value})} 
                    required 
                />
                
                {/* Category Selection */}
                <select 
                    className="w-full p-2 border rounded"
                    value={product.category}
                    onChange={(e) => setProduct({...product, category: e.target.value})}
                    required
                >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <textarea 
                    placeholder="Description" 
                    className="w-full p-2 border rounded h-32"
                    value={product.description} 
                    onChange={(e) => setProduct({...product, description: e.target.value})} 
                />
                
                <button 
                    type="button" 
                    onClick={handleGenerateDescription} 
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
                >
                    {loading ? "AI is thinking..." : "Generate Description with AI"}
                </button>
                
                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Save Product
                </button>
            </form>
        </div>
    );
};

export default AddProductPage;