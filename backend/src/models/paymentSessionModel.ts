import mongoose from "mongoose";

export interface PaymentSession extends mongoose.Document {
  sessionId: string;
  vendorId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  vendorWallet: string;
  expectedAmount: string;
  isCustom: boolean;
  status: "pending" | "completed" | "failed" | "expired";
  txHash?: string;
  transactionId?: string;
  createdAt: Date;
  expiresAt: Date;
}

const paymentSessionSchema = new mongoose.Schema<PaymentSession>({
  sessionId: { type: String, unique: true, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product"},
  vendorWallet: { type: String, required: true },
  isCustom:{type:Boolean, default:false},

  expectedAmount: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "expired"],
    default: "pending",
  },

  transactionId: { type: String, unique: true, sparse: true },
  txHash: { type: String },

  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
});

// TTL Index to auto-expire
paymentSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 }); //
paymentSessionSchema.index({ txHash: 1 }, { unique: true, sparse: true });

paymentSessionSchema.pre("save", function (next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  }
  next();
});

const PaymentSession = mongoose.model<PaymentSession>("PaymentSession", paymentSessionSchema);
export { PaymentSession };
