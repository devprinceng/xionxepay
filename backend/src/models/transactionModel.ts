import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        transactionId: { type: String, unique: true,}, // Unique transaction ID
        transactionHash: { type: String, unique: true, sparse:true},  // Blockchain transaction hash
        amount: { type: Number, required: true }, 
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Product ID
        status: { type: String, enum: ["pending", "completed", "failed", "expired"], default: "pending" }, 
        description: { type: String, default: "" }, 
        transactionTime: { type: Date}, // Timestamp of the transaction completion
    },
    {
        timestamps: true, 
    }
);
// transactionSchema.pre("save", function (next) {
//     if (!this.transactionHash) {
//         this.transactionHash = "temp/" + v4(); // Generate a unique transaction hash if not provided
//     }
//     next();
// });


const Transaction = mongoose.model("Transaction", transactionSchema);
export { Transaction };
