import React, { useEffect, useState } from 'react';
import API from '../api';

const Footer = () => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        API.get('/settings').then(res => setInfo(res.data));
    }, []);

    return (
        <footer className="bg-gray-900 text-white p-8 mt-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="font-bold text-lg">TrustPayEcommerce</h3>
                    <p>{info.address}</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Support</h3>
                    <p>Email: {info.supportEmail}</p>
                    <p>Phone: {info.phoneNumber}</p>
                </div>
                <div>
                    <h3 className="font-bold text-lg">Disputes</h3>
                    <p>Escrow Inquiries: {info.disputeEmail}</p>
                </div>
            </div>
            <p className="text-center mt-8 text-gray-500">© 2026 TrustPayEcommerce Ecommerce Ltd.</p>
        </footer>
    );
};

export default Footer;