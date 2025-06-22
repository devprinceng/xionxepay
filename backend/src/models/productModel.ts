import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Product name
    price: { type: Number, required: true }, // Product price
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, // Reference to the vendor
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const Product = mongoose.model("Product", productSchema);
export { Product };