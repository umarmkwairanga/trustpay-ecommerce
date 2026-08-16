import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminAdsPage() {
    const [ads, setAds] = useState([]);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedAdId, setSelectedAdId] = useState(null);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        const res = await axios.get('/api/advertisements/admin/all', { withCredentials: true });
        setAds(res.data.data);
    };

    const handleApprove = async (id) => {
        await axios.put(`/api/advertisements/admin/${id}/approve`, {}, { withCredentials: true });
        fetchAds();
    };

    const handleReject = async (id) => {
        if (!rejectReason) return alert('Please enter a rejection reason.');
        await axios.put(`/api/advertisements/admin/${id}/reject`, { reason: rejectReason }, { withCredentials: true });
        setSelectedAdId(null);
        setRejectReason('');
        fetchAds();
    };

    return (
        <div style={{ backgroundColor: '#F7F9FC', minHeight: '100vh', padding: '24px', color: '#0B1B3A' }}>
            <h2 style={{ color: '#0B1B3A', fontWeight: 'bold' }}>Advertisement Moderation & Management</h2>
            <table style={{ width: '100%', background: '#FFF', borderCollapse: 'collapse', borderRadius: '8px', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <thead>
                    <tr style={{ background: '#2D7DFF', color: '#FFF', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Title</th>
                        <th style={{ padding: '12px' }}>Seller</th>
                        <th style={{ padding: '12px' }}>Type</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px' }}>AI Safety Score</th>
                        <th style={{ padding: '12px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ads.map(ad => (
                        <tr key={ad._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{ad.title}</td>
                            <td style={{ padding: '12px' }}>{ad.seller?.storeName || 'Seller'}</td>
                            <td style={{ padding: '12px' }}>{ad.adType}</td>
                            <td style={{ padding: '12px', fontWeight: 'bold' }}>{ad.status}</td>
                            <td style={{ padding: '12px', color: ad.aiSafetyScore < 70 ? 'red' : '#1DBF73' }}>{ad.aiSafetyScore}/100</td>
                            <td style={{ padding: '12px' }}>
                                {ad.status === 'Pending Approval' && (
                                    <>
                                        <button onClick={() => handleApprove(ad._id)} style={{ background: '#1DBF73', color: '#FFF', border: 'none', padding: '5px 10px', marginRight: '5px', borderRadius: '4px' }}>Approve</button>
                                        <button onClick={() => setSelectedAdId(ad._id)} style={{ background: '#FF6A00', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>Reject</button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedAdId && (
                <div style={{ marginTop: '20px', background: '#FFF', padding: '20px', borderRadius: '8px' }}>
                    <h4>Provide Rejection Reason</h4>
                    <input type="text" placeholder="Reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} style={{ width: '100%', padding: '8px', margin: '10px 0' }} />
                    <button onClick={() => handleReject(selectedAdId)} style={{ background: '#FF6A00', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>Confirm Rejection</button>
                </div>
            )}
        </div>
    );
}