import React, { useState } from 'react';
import API from '../api';

const AdminSettings = () => {
    const [profile, setProfile] = useState({
        supportEmail: '',
        disputeEmail: '',
        phoneNumber: '',
        address: '',
        website: ''
    });

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await API.post('/admin/settings', profile);
            alert('Business profile updated successfully!');
        } catch (err) {
            alert('Failed to save settings');
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Business Profile & Contact Info</h1>
            <form onSubmit={handleSave} className="space-y-4">
                <input 
                    className="w-full p-2 border rounded" 
                    placeholder="Support Email" 
                    onChange={(e) => setProfile({...profile, supportEmail: e.target.value})} 
                />
                <input 
                    className="w-full p-2 border rounded" 
                    placeholder="Dispute Email" 
                    onChange={(e) => setProfile({...profile, disputeEmail: e.target.value})} 
                />
                <input 
                    className="w-full p-2 border rounded" 
                    placeholder="Phone Number (+234...)" 
                    onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} 
                />
                <textarea 
                    className="w-full p-2 border rounded" 
                    placeholder="Full Office Address" 
                    onChange={(e) => setProfile({...profile, address: e.target.value})} 
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save Profile
                </button>
            </form>
        </div>
    );
};

export default AdminSettings;