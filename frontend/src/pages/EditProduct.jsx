import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [product, setProduct] = useState({ name: '', price: '' });

    // 1. Fetch current product details
    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`http://axios.get("http://http://localhost:5000/api/products")/api/products/${id}`);
            setProduct(data);
        };
        fetchProduct();
    }, [id]);

    // 2. Handle the Save
    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://axios.get("http://http://localhost:5000/api/products")/api/products/${id}`, product);
        alert("Product updated successfully!");
        navigate('/admin/products');
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Edit Product</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={product.name} 
                    onChange={(e) => setProduct({...product, name: e.target.value})} 
                    placeholder="Product Name" 
                />
                <input 
                    type="number" 
                    value={product.price} 
                    onChange={(e) => setProduct({...product, price: e.target.value})} 
                    placeholder="Price" 
                />
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProduct;