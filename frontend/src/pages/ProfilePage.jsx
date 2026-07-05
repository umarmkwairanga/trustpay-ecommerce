import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Ensure this is the correct path
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <h2 className="text-3xl font-bold mb-6">My Profile</h2>
            <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">{user?.username}</h3>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>
                
                <div className="border-t pt-4">
                    <h4 className="font-bold mb-2">Account Settings</h4>
                    <p className="text-gray-600 mb-4">Manage your TrustPayEcommerce account details and security preferences here.</p>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;