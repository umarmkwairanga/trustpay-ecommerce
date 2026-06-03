const express = require("express");
const router = express.Router();
const { getOrderMessages, sendMessage } = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.get("/:orderId", protect, getOrderMessages);
router.post("/", protect, sendMessage);

module.exports = router;