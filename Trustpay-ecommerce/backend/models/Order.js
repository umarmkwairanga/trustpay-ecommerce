const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    reference: { type: String, required: true, unique: true },
    status: {
      type: String,
      default: "Awaiting Payment",
      enum: [
        "Awaiting Payment",
        "Secured in Escrow",
        "Dispatched",
        "Completed",
        "Disputed",
        "Refunded"
      ]
    },
    deliveryTrackingId: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);