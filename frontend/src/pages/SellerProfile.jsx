import React, { useState, useEffect } from 'react';
import API from '../api';

const SellerProfile = () => {
    const [profile, setProfile] = useState({
        bankName: '',
        accountName: '',
        accountNumber: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/users/profile');
                setProfile(data);
            } catch (err) {
                console.error("Error fetching profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put('/users/profile', profile);
            alert("Banking details updated successfully!");
        } catch (err) {
            alert("Failed to update banking details");
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded">
            <h2 className="text-2xl font-bold mb-6">Banking Information</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Bank Name</label>
                    <select 
                        value={profile.bankName}
                        onChange={(e) => setProfile({...profile, bankName: e.target.value})}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="">Select Bank</option>
                        <option value="Access Bank">Access Bank</option>
                        <option value="GTBank">GTBank</option>
                        <option value="Zenith Bank">Zenith Bank</option>
                        <option value="First Bank">First Bank</option>
                        <option value="UBA">UBA</option>
                        <option value="EcoBank">EcoBank</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Account Name</label>
                    <input 
                        className="w-full p-2 border rounded"
                        value={profile.accountName}
                        onChange={(e) => setProfile({...profile, accountName: e.target.value})}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Account Number</label>
                    <input 
                        className="w-full p-2 border rounded"
                        value={profile.accountNumber}
                        onChange={(e) => setProfile({...profile, accountNumber: e.target.value})}
                        required
                    />
                </div>
                <button className="bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition">
                    Save Banking Details
                </button>
            </form>
        </div>
    );
};

export default SellerProfile;