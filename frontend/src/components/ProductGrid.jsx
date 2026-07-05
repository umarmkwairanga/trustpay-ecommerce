import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure you import your Auth context

function ProductGrid() {
  const [products, setProducts] = useState([]);
  const { user } = useAuth(); // Access user role from AuthContext

  useEffect(() => {
    fetch('http://localhost:3000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          // Filter out the deleted product from state to update UI immediately
          setProducts(products.filter(product => product._id !== id));
          alert("Product deleted successfully");
        }
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div key={product._id} className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-transform hover:scale-105">
          {product.imagePath ? (
            <img 
              src={`http://localhost:3000/${product.imagePath}`} 
              alt={product.name} 
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
          )}

          <div className="p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">{product.category || 'General'}</span>
            <h3 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description || 'No description available'}</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-lg font-bold text-green-600">${product.price}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </span>
            </div>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Add to Cart
            </button>

            {/* Admin-only Delete Button */}
            {user?.role === 'admin' && (
              <button 
                onClick={() => handleDelete(product._id)}
                className="mt-2 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete Product
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;