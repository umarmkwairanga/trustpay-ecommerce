// src/components/ProductCard.jsx
const handleEscrow = async () => {
    try {
      const response = await api.post('/api/escrow/initiate', {
        productId: id,
        amount: price
      });
      alert("Escrow initiated! ID: " + response.data.transactionId);
    } catch (err) {
      // This will show exactly what went wrong
      const errorDetail = err.response?.data?.message || err.message;
      alert("Error: " + errorDetail);
      console.error("Full Error Object:", err);
    }
  };