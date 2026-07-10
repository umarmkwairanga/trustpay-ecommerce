import React, { useState, useEffect } from 'react';

const FlashDeals = ({ expiryTime, discount }) => {
  const [timeLeft, setTimeLeft] = useState(expiryTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  return (
    <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg my-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-bold">⚡ Flash Deal!</h2>
        <p>Save {discount}% on selected items</p>
      </div>
      <div className="text-2xl font-mono font-bold">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
};

export default FlashDeals;