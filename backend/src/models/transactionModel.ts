import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, 
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, 
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, 
    description: { type: String, default: "" }, 
    transactionHash: { type: String, required: true, unique: true }, 
  },
  {
    timestamps: true, 
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export { Transaction };
