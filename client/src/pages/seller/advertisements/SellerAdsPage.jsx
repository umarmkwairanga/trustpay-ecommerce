import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function SellerAdsPage() {
    const [campaigns, setCampaigns] = useState([]);
    const [form, setForm] = useState({
        title: '', description: '', adType: 'featured_product',
        targetModel: 'Product', targetReference: '', bannerUrl: '',
        destinationUrl: '', startDate: '', endDate: ''
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        const res = await axios.get('/api/advertisements/seller/campaigns', { withCredentials: true });
        setCampaigns(res.data.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/advertisements/campaigns', form, { withCredentials: true });
            alert('Campaign draft created successfully!');
            fetchCampaigns();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating campaign');
        }
    };

    return (
        <div style={{ backgroundColor: '#F7F9FC', minHeight: '100vh', padding: '24px', color: '#0B1B3A' }}>
            <h2 style={{ color: '#FF6A00', fontWeight: 'bold' }}>Seller Advertising & Marketing</h2>
            
            {/* Campaign Creator Form */}
            <form onSubmit={handleCreate} style={{ background: '#FFF', padding: '20px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3>Create New Campaign</h3>
                <input type="text" placeholder="Campaign Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
                <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
                <select value={form.adType} onChange={e => setForm({...form, adType: e.target.value})} style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }}>
                    <option value="featured_product">Featured Product</option>
                    <option value="homepage_banner">Homepage Banner</option>
                    <option value="featured_store">Featured Store</option>
                </select>
                <input type="text" placeholder="Product/Listing ID" value={form.targetReference} onChange={e => setForm({...form, targetReference: e.target.value})} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
                <input type="text" placeholder="Banner Image URL" value={form.bannerUrl} onChange={e => setForm({...form, bannerUrl: e.target.value})} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
                <input type="text" placeholder="Destination URL" value={form.destinationUrl} onChange={e => setForm({...form, destinationUrl: e.target.value})} required style={{ display: 'block', margin: '10px 0', padding: '8px', width: '100%' }} />
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required style={{ padding: '8px', flex: 1 }} />
                    <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required style={{ padding: '8px', flex: 1 }} />
                </div>
                <button type="submit" style={{ background: '#FF6A00', color: '#FFF', border: 'none', padding: '10px 20px', marginTop: '15px', borderRadius: '4px', cursor: 'pointer' }}>Create Campaign Draft & Calculate Price</button>
            </form>

            {/* Campaign List */}
            <h3>Your Campaigns</h3>
            <table style={{ width: '100%', background: '#FFF', borderCollapse: 'collapse', borderRadius: '8px', overflow: 'hidden' }}>
                <thead>
                    <tr style={{ background: '#0B1B3A', color: '#FFF', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>Type</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>Price</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {campaigns.map(ad => (
                        <tr key={ad._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{ad.title}</td>
                            <td style={{ padding: '12px' }}>{ad.adType}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold', color: ad.status === 'Active' ? '#1DBF73' : '#2D7DFF' }}>{ad.status}</td>
                            <td style={{ padding: '12px' }}>${ad.totalPrice}</td>
                            <td style={{ padding: '12px' }}>
                                {ad.status === 'Active' && <button onClick={() => axios.put(`/api/advertisements/campaigns/${ad._id}/pause`, {}, {withCredentials: true}).then(fetchCampaigns)} style={{ background: '#FF6A00', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Pause</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}