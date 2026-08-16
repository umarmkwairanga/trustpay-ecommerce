import React from 'react';

const FAQ = () => {
  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      
      <div className="space-y-6">
        <div>
          <h3 className="font-bold text-lg text-blue-900">How does TrustPayEcommerce escrow work?</h3>
          <p className="text-gray-700">When you pay for an order, we hold the funds in a secure vault. We only release the payment to the seller once you have confirmed receipt of your item.</p>
        </div>

        <div>
          <h3 className="font-bold text-lg text-blue-900">What if I don't receive my order?</h3>
          <p className="text-gray-700">If your order hasn't arrived, you can initiate a dispute through your Order History. Our support team will investigate and ensure you receive a refund if the delivery fails.</p>
        </div>

        <div>
          <h3 className="font-bold text-lg text-blue-900">How long does it take for a seller to get paid?</h3>
          <p className="text-gray-700">Sellers receive their funds immediately after the delivery rider marks the order as "Delivered" and you confirm it, or 48 hours after delivery if no dispute is raised.</p>
        </div>

        <div>
          <h3 className="font-bold text-lg text-blue-900">Can I track my delivery?</h3>
          <p className="text-gray-700">Yes! Once a rider is assigned, you can see their real-time location on the map within your Order Details page.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;