import mongoose from "mongoose";



const transactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    transactionHash: { type: String},
    amount: { type: Number, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    paymentSessionId: { type: mongoose.Schema.Types.ObjectId, ref: "PaymentSession" }, // New
    isCustom: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "expired"],
      default: "pending",
    },

    description: { type: String, default: "" },
    transactionTime: { type: Date },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

transactionSchema.index({ transactionHash: 1 }, { unique: true, sparse: true });

const Transaction = mongoose.model("Transaction", transactionSchema);
export { Transaction };
