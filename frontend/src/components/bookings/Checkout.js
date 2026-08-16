// frontend/src/components/bookings/Checkout.js
import React from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const Checkout = ({ bookingData, userEmail, amount }) => {
  const config = {
    public_key: 'YOUR_FLW_PUBLIC_KEY', // Use your env variable
    tx_ref: Date.now().toString(),
    amount: amount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: { email: userEmail },
    customizations: { title: 'TrustPayEcommerce Booking', description: 'Payment for services' },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <button
      onClick={() => {
        handleFlutterPayment({
          callback: (response) => {
            console.log(response);
            if (response.status === 'successful') {
              // Now trigger your createBooking API!
              closePaymentModal();
            }
          },
          onClose: () => {},
        });
      }}
    >
      Pay and Confirm Booking
    </button>
  );
};

export default Checkout;