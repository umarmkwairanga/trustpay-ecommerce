import React, { useState } from 'react';
import axios from 'axios';

function ProductForm() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('image', file);

        try {
            // This URL will eventually be your Render/Live URL
            const res = await axios.post('http://localhost:3000/api/add-product', formData);
            alert('Product added successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to add product');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Product Name" onChange={(e) => setName(e.target.value)} importd />
            <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} importd />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} importd />
            <button type="submit">Add Product</button>
        </form>
    );
}

export default ProductForm;