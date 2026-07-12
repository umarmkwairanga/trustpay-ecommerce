import { useState } from 'react';
import axios from 'axios';

const BankDetailsForm = () => {
    const [details, setDetails] = useState({
        bankName: '',
        bankCode: '',
        accountName: '',
        accountNumber: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure you have an auth token in your header if using protect middleware
            await axios.put('http://localhost:5000/api/users/bank-details', details, {
                withCredentials: true
            });
            alert('Bank details saved successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to save details');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">Payout Settings</h2>
            <input className="block w-full p-2 mb-2 border" placeholder="Account Name" onChange={(e) => setDetails({...details, accountName: e.target.value})} />
            <input className="block w-full p-2 mb-2 border" placeholder="Account Number" onChange={(e) => setDetails({...details, accountNumber: e.target.value})} />
            <input className="block w-full p-2 mb-2 border" placeholder="Bank Name" onChange={(e) => setDetails({...details, bankName: e.target.value})} />
            <input className="block w-full p-2 mb-2 border" placeholder="Bank Code" onChange={(e) => setDetails({...details, bankCode: e.target.value})} />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded">Save Details</button>
        </form>
    );
};

export default BankDetailsForm;