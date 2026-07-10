import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import FlutterwaveButton from '../components/FlutterwaveButton'; // Import the component we discussed

const CartView = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Assuming user info is in localStorage or Auth context
  const user = JSON.parse(localStorage.getItem('user') || '{}'); 
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // This function is triggered by FlutterwaveButton after payment success
  const handlePaymentSuccess = () => {
    alert("Payment Successful! Funds are now securely held in TrustPay escrow.");
    clearCart();
    navigate('/orders');
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
              <button 
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-6 text-xl font-bold mb-4">
            Total: ${total.toFixed(2)}
          </div>

          {/* Integration of FlutterwaveButton */}
          <FlutterwaveButton 
            amount={total} 
            email={user.email || "buyer@example.com"} 
            items={cart}
            sellerId={cart[0]?.sellerId} // Assuming seller info is attached to cart item
            onSuccess={handlePaymentSuccess}
          />
        </div>
      )}
    </div>
  );
};

export default CartView;