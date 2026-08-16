import React from 'react';

const About = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">About TrustPayEcommerce</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="text-gray-700">
          TrustPayEcommerce is dedicated to revolutionizing online commerce in Nigeria by providing a 
          secure, transparent, and neutral escrow platform. We eliminate the fear of fraud 
          by ensuring that funds are only released to sellers once the buyer confirms 
          satisfactory delivery.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Why Choose TrustPayEcommerce?</h2>
        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li><strong>Escrow Protection:</strong> Your money is held in a secure vault until you are satisfied.</li>
          <li><strong>Real-time Tracking:</strong> Monitor your delivery via GPS integrated directly into our platform.</li>
          <li><strong>Neutral Arbitration:</strong> Our expert dispute team ensures fair resolution for all parties.</li>
        </ul>
      </section>
    </div>
  );
};

export default About;