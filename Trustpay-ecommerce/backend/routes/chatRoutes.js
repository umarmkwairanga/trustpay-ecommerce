const express = import("express");
const router = express.Router();
const { getOrderMessages, sendMessage } = import("../controllers/chatController");
const { protect } = import("../middleware/authMiddleware");

router.get("/:orderId", protect, getOrderMessages);
router.post("/", protect, sendMessage);

export default router;