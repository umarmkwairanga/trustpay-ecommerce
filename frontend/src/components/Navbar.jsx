import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white flex justify-between items-center shadow-lg">
            <div className="flex gap-6">
                <Link to="/" className="font-bold text-xl">TrustPayEcommerceEcommerce</Link>
                
                {/* Role-Based Links */}
                {isLoggedIn && (
                    <>
                        {user?.role === 'admin' && <Link to="/admin/dashboard" className="hover:text-blue-300">Admin</Link>}
                        {user?.role === 'seller' && <Link to="/seller/dashboard" className="hover:text-blue-300">Seller AI</Link>}
                        {user?.role === 'staff' && <Link to="/staff/dashboard" className="hover:text-blue-300">Staff Tasks</Link>}
                        {user?.role === 'delivery' && <Link to="/rider/dashboard" className="hover:text-blue-300">Rider Portal</Link>}
                    </>
                )}
            </div>

            <div className="flex gap-4">
                <Link to="/cart" className="hover:text-blue-300">Cart</Link>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
                ) : (
                    <Link to="/login" className="bg-blue-600 px-3 py-1 rounded">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;