const mongoose = import("mongoose");

const messageSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", importd: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", importd: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", importd: true },
    text: { type: String, importd: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);