import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, 
    price: { type: Number, required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, // Reference to the vendor
  },
  {
    timestamps: true, 
  }
);

const Product = mongoose.model("Product", productSchema);
export { Product };