import React, { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const Checkout = ({ amount, buyerEmail, buyerName, txRef }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const config = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: txRef,
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,banktransfer,ussd',
    customer: {
      email: buyerEmail,
      name: buyerName,
    },
    customizations: {
      title: 'TrustPay Escrow',
      description: 'Secure payment for your transaction',
      logo: 'https://your-logo-url.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePaymentClick = () => {
    setIsProcessing(true);
    
    handleFlutterPayment({
      callback: (response) => {
        console.log("Payment response:", response);
        // Note: Logic here is for UI feedback. 
        // Always rely on your server-side Webhook for final escrow status.
        setIsProcessing(false);
        closePaymentModal();
        
        if (response.status === 'successful') {
          alert('Payment successful! Your funds are now in escrow.');
        } else {
          alert('Payment was not successful. Please try again.');
        }
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });
  };

  return (
    <button
      disabled={isProcessing}
      className={`px-6 py-2 rounded shadow text-white transition-colors duration-200 
        ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      onClick={handlePaymentClick}
    >
      {isProcessing ? 'Processing...' : `Pay ₦${amount.toLocaleString()}`}
    </button>
  );
};

export default Checkout;