import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Footer() {
  const [settings, setSettings] = useState({
    supportEmail: 'support@trustpayecommerce.com',
    supportPhone: '+234 800 TRUSTPAY',
    disputeEmail: 'disputes@trustpayecommerce.com'
  });

  useEffect(() => {
    let isMounted = true;
    api.get('/settings')
      .then((res) => {
        if (isMounted && res.data) {
          setSettings({
            supportEmail: res.data.supportEmail || 'support@trustpayecommerce.com',
            supportPhone: res.data.supportPhone || '+234 800 TRUSTPAY',
            disputeEmail: res.data.disputeEmail || 'disputes@trustpayecommerce.com'
          });
        }
      })
      .catch((err) => {
        console.warn('Could not fetch dynamic footer settings, using defaults.', err);
      });
    return () => { isMounted = false; };
  }, []);

  return (
    <footer style={{ backgroundColor: '#0B1B3A', color: '#fff', padding: '2rem 1rem', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h3 style={{ color: '#FF6A00', margin: '0 0 0.5rem 0' }}>TrustPay Ecommerce</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>Secure Multi-Vendor Escrow Marketplace</p>
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Support</h4>
          <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#ccc' }}>Email: {settings.supportEmail}</p>
          <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#ccc' }}>Phone: {settings.supportPhone}</p>
        </div>
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Disputes</h4>
          <p style={{ margin: '0.2rem 0', fontSize: '0.9rem', color: '#ccc' }}>Escrow Inquiries: {settings.disputeEmail}</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.8rem', color: '#aaa' }}>
        &copy; 2026 TrustPay Ecommerce Ltd. All rights reserved.
      </div>
    </footer>
  );
}