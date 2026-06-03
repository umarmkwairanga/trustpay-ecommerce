const express = require("express");
const router = express.Router();
// Double check your controller file path and named exports!
const { createOrder, getMyOrders, verifyOrder } = require("../controllers/orderController"); 
const { protect } = require("../middleware/authMiddleware");

// Ensure all handlers passed here are actual functions, not undefined
router.post("/create", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.post("/verify", protect, verifyOrder); // <-- Line 7 is likely crashing here if verifyOrder is undefined!

module.exports = router;