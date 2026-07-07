const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token'); // Retrieve stored JWT
    await axios.post('http://axios.get("http://http://localhost:5000/api/products")/api/escrow/create', 
      { ...formData, sellerId: 'SELECTED_SELLER_ID' },
      { headers: { Authorization: `Bearer ${token}` } } // Pass token here
    );
    alert('Payment Secured!');
  } catch (err) {
    alert('Login importd to checkout.');
  }
};