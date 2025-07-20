import mongoose from "mongoose";

export interface PaymentSession extends mongoose.Document {
  sessionId:{ type: string; unique: true };
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true };
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }; // Product ID
  customerEmail?: string;
  vendorWallet?:string;
  expectedAmount: string;
  status: "pending" | "completed" | "failed"| "expired";
  txHash?: string;
  createdAt: Date;
  expiresAt: Date;
}

const paymentSessionSchema = new mongoose.Schema({
  sessionId: { type: String, unique: true, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  vendorWallet: { type: String, required: true }, // Vendor's wallet address
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Product ID
  customerEmail:{ type: String, unique: true },
  expectedAmount: String,
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "expired"],
    default: "pending",
  },
  transactionId: { type: String, unique: true,}, 
  txHash: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

paymentSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 }); // Automatically delete expired sessions after 24 hours
paymentSessionSchema.pre<PaymentSession>("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Set timeout to 10 minutes by default
  }
  next();
});

const PaymentSession = mongoose.model("PaymentSession", paymentSessionSchema);
export { PaymentSession };