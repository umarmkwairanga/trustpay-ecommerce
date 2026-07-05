import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BankLinker = () => {
    const [banks, setBanks] = useState([]);
    const [formData, setFormData] = useState({ account_number: '', bank_code: '', account_name: '' });

    // 1. Fetch bank list from Paystack on load
    useEffect(() => {
        axios.get('https://api.paystack.co/bank')
            .then(res => setBanks(res.data.data))
            .catch(err => console.error("Error fetching banks", err));
    }, []);

    // 2. Submit to your Backend
    const handleLinkBank = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users/link-bank', formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert("Bank account linked successfully!");
        } catch (err) {
            alert("Failed to link bank account");
        }
    };

    return (
        <form onSubmit={handleLinkBank} className="p-4 border rounded shadow-sm">
            <h2 className="text-xl font-bold mb-4">Link Bank Account for Payouts</h2>
            
            <select onChange={(e) => setFormData({...formData, bank_code: e.target.value})} className="w-full mb-3 p-2 border">
                <option>Select your Bank</option>
                {banks.map(bank => <option key={bank.code} value={bank.code}>{bank.name}</option>)}
            </select>

            <input type="text" placeholder="Account Number" onChange={(e) => setFormData({...formData, account_number: e.target.value})} className="w-full mb-3 p-2 border" />
            <input type="text" placeholder="Account Name" onChange={(e) => setFormData({...formData, account_name: e.target.value})} className="w-full mb-3 p-2 border" />
            
            <button type="submit" className="w-full bg-navy text-white p-2 rounded">Link Account</button>
        </form>
    );
};

export default BankLinker;