// Inside backend/controllers/orderController.js

const createOrder = async (req, res) => { /* ... */ };
const getMyOrders = async (req, res) => { /* ... */ };

// Ensure this exact function exists!
const verifyOrder = async (req, res) => {
  try {
    const { reference } = req.body;
    // Your escrow logic here...
    res.json({ message: "Escrow funds released successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUCIAL: Make sure verifyOrder is included in this exports object!
module.exports = {
  createOrder,
  getMyOrders,
  verifyOrder
};