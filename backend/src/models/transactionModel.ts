import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        amount: { type: Number, required: true }, 
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Product ID
        status: { type: String, enum: ["pending", "completed", "failed", "expired"], default: "pending" }, 
        description: { type: String, default: "" }, 
        transactionId: { type: String, unique: true,}, // Unique transaction ID
        transactionHash: { type: String, unique: true },
        transactionTime: { type: Date}, // Timestamp of the transaction completion
    },
    {
        timestamps: true, 
    }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export { Transaction };
