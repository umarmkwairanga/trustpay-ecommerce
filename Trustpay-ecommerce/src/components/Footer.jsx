import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Support Section */}
        <div>
          <h3 className="text-lg font-bold mb-4">Support</h3>
          <p>Email: support@trustpay.com</p>
          <p>Phone: +234 123 456 7890</p>
        </div>

        {/* Disputes & Legal */}
        <div>
          <h3 className="text-lg font-bold mb-4">Legal & Disputes</h3>
          <ul className="space-y-2">
            <li><Link to="/legal/escrow" className="hover:text-blue-400">Escrow Inquiries</Link></li>
            <li><Link to="/legal/privacy" className="hover:text-blue-400">Privacy Policy</Link></li>
            <li><Link to="/legal/buyer-protection" className="hover:text-blue-400">Buyer Protection</Link></li>
          </ul>
        </div>

        {/* Company Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">TrustPay Ecommerce</h3>
          <p className="text-sm text-gray-400">
            Secure, reliable, and AI-powered e-commerce for everyone.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-8 border-t border-gray-800 pt-6 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} TrustPay Ecommerce Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;