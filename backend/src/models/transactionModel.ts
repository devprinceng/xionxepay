import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true }, // Transaction amount
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, // Reference to the vendor
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, // Transaction status
    description: { type: String, default: "" }, // Description of the transaction
    transactionHash: { type: String, required: true, unique: true }, // Unique hash for the transaction
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export { Transaction };
// Export the Transaction model