import React from 'react';

const LandingPage = () => {
  return (
    <div className="landing-container" style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      {/* Hero Section */}
      <header style={{ textAlign: 'center', margin: '4rem 0' }}>
        <h1 style={{ fontSize: '3rem', color: '#2563eb' }}>TrustPayEcommerce</h1>
        <p style={{ fontSize: '1.25rem', color: '#4b5563' }}>
          Secure, transparent escrow services for the Nigerian marketplace.
        </p>
        <button style={{ padding: '1rem 2rem', marginTop: '1rem', cursor: 'pointer' }}>
          Join the Waitlist
        </button>
      </header>

      {/* Features Section */}
      <section style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>For Buyers</h3>
          <p>Pay with confidence. Funds are only released when you confirm delivery.</p>
        </div>
        <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
          <h3>For Sellers</h3>
          <p>Get paid safely. No more risk of chargebacks or fraudulent transactions.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: '4rem', textAlign: 'center', color: '#9ca3af' }}>
        <p>© 2026 TrustPayEcommerce. Building the future of secure commerce.</p>
      </footer>
    </div>
  );
};

export default LandingPage;