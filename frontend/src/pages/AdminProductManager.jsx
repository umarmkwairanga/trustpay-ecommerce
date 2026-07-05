import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const AdminProductManager = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await api.delete(`/admin/products/${id}`);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                alert("Failed to delete product.");
            }
        }
    };

    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <h2>Product Management</h2>
            <Link to="/admin/add-product">
                <button>+ Add New Product</button>
            </Link>
            
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product._id}>
                            <td>{product.name}</td>
                            <td>${product.price}</td>
                            <td>
                                <Link to={`/admin/edit/${product._id}`}>
                                    <button>Edit</button>
                                </Link>
                                <button onClick={() => handleDelete(product._id)} style={{ marginLeft: '10px' }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminProductManager;