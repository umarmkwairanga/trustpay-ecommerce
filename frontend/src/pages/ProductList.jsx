import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Groceries', 'Automotive'];

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Corrected: Only one declaration, using relative path
                const response = await axios.get('/api/products');
                setProducts(response.data);
                setFilteredProducts(response.data);
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    const handleFilter = (category) => {
        setActiveCategory(category);
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === category));
        }
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-3xl font-bold text-center mb-8">Available Products</h2>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => handleFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                            activeCategory === cat ? 'bg-blue-600 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
                {filteredProducts.map(product => (
                    <div key={product._id} className={`bg-white p-6 rounded-xl shadow-lg border ${product.isFlashDeal ? 'border-red-500 ring-2 ring-red-100' : 'border-gray-100'} flex flex-col`}>
                        {product.isFlashDeal && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase self-start mb-2 animate-pulse">
                                🔥 Flash Deal
                            </span>
                        )}
                        <span className="text-xs font-bold text-blue-600 uppercase mb-2">{product.category}</span>
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-gray-600 text-sm mt-2 flex-grow">{product.description}</p>
                        
                        <div className="mt-4">
                            {product.isFlashDeal ? (
                                <p className="text-lg font-bold text-red-600">
                                    <span className="line-through text-gray-400 text-sm mr-2">${product.originalPrice}</span>
                                    ${product.price}
                                </p>
                            ) : (
                                <p className="text-lg font-bold text-green-600">Price: ${product.price}</p>
                            )}
                        </div>
                        
                        {localStorage.getItem('token') ? (
                            <button 
                                onClick={() => navigate(`/checkout/${product._id}`)}
                                className={`mt-4 w-full py-2 rounded-lg transition ${product.isFlashDeal ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                            >
                                Buy Now
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate('/login')}
                                className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                            >
                                Login to Buy
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;