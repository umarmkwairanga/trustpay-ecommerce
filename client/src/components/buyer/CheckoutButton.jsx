import React, { useState } from 'react';
import axios from 'axios';

const CheckoutButton = ({ amount, email }) => {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // Ensure this URL matches your backend port (usually 5000)
            const response = await axios.post('http://axios.get("http:///api/api/products")/api/payment/create', {
                amount,
                email
            });

            // Redirect user to Flutterwave's secure payment page
            if (response.data && response.data.data.link) {
                window.location.href = response.data.data.link;
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Could not start payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handlePayment} 
            disabled={loading}
            className="btn-pay"
        >
            {loading ? "Processing..." : "Pay Now"}
        </button>
    );
};

export default CheckoutButton;