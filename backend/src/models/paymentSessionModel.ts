import mongoose from "mongoose";

export interface PaymentSession extends mongoose.Document {
  sessionId: string;
  vendorId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  customerEmail?: string;
  vendorWallet?: string;
  expectedAmount: string;
  status: "pending" | "completed" | "failed" | "expired";
  txHash?: string;
  transactionId?: string;
  createdAt: Date;
  expiresAt: Date;
}

const paymentSessionSchema = new mongoose.Schema<PaymentSession>({
  sessionId: { type: String, unique: true, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  vendorWallet: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  customerEmail: { type: String }, // no sparse here
  expectedAmount: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "expired"],
    default: "pending",
  },
  transactionId: { type: String, unique: true, sparse: true },
  txHash: { type: String }, // no index here
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

// Indexes
paymentSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });
paymentSessionSchema.index({ txHash: 1 }, { unique: true, sparse: true });

paymentSessionSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min default
  }
  next();
});

const PaymentSession = mongoose.model<PaymentSession>("PaymentSession", paymentSessionSchema);
export { PaymentSession };
