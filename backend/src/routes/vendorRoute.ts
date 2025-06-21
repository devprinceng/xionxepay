import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  vendorProfile,
  updateVendorProfile} from "../controllers/vendorController";
// Importing necessary controllers for handling vendor routes

const vendorRouter = express.Router();
// Define vendor routes
vendorRouter.get("/profile", isAuthenticated, vendorProfile); // Get vendor profile
vendorRouter.put("/profile", isAuthenticated, updateVendorProfile); // Update vendor profile
// Export the vendor router
export default vendorRouter;
// vendorRoute.ts
