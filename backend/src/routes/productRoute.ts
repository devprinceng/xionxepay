import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const productRouter = express.Router();

  // Create a new product
  productRouter.post("/create", isAuthenticated, createProduct);

  // Get all products for the authenticated vendor
  productRouter.get("/", isAuthenticated, getProducts);

  // Get a specific product by ID for the authenticated vendor
  productRouter.get("/single", isAuthenticated, getProductById);

  // Update a product by ID for the authenticated vendor
  productRouter.put("/single", isAuthenticated, updateProduct);

  // Delete a product by ID for the authenticated vendor
  productRouter.delete("/single", isAuthenticated, deleteProduct);

export default productRouter;