import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, 
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, 
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, 
    description: { type: String, default: "" }, 
    transactionHash: { type: String, required: true, unique: true },
    url:{ type: String, default: "" }, // URL to the transaction details or receipt
  },
  {
    timestamps: true, 
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export { Transaction };
