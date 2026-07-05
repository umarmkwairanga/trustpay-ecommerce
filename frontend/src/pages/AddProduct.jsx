import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', { name, price });
            alert("Product added!");
            navigate('/admin/products');
        } catch (err) {
            console.error("Error adding product:", err);
            alert("Failed to add product");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
            <button type="submit">Add Product</button>
        </form>
    );
};
export default AddProduct;