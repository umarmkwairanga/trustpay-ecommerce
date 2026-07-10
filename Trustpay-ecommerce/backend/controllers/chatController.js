const Message = import("../models/Message");
const Order = import("../models/Order");

// FETCH CONVERSATION HISTORY FOR AN ESCROW ORDER
exports.getOrderMessages = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Verify the user belongs to this order contract before showing messages
    const order = await Order.findById(orderId);
    if (!order || (order.buyer.toString() !== req.user.id && order.seller.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Unauthorized to access this chat line." });
    }

    const chatHistory = await Message.find({ order: orderId })
      .populate("sender", "name")
      .sort({ createdAt: 1 }); // Oldest to newest
      
    res.json(chatHistory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching chat room history", error: error.message });
  }
};

// SEND NEW SECURE MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    const { orderId, text } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order contract not found" });

    // Deduce who the recipient is based on who is sending it
    const recipient = req.user.id === order.buyer.toString() ? order.seller : order.buyer;

    const newMessage = await Message.create({
      order: orderId,
      sender: req.user.id,
      recipient,
      text
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Message transmission failed", error: error.message });
  }
};