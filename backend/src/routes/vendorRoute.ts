import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import {
  getVendorProfile,
  updateVendorProfile,updateVendorBusiness} from "../controllers/vendorController";
import upload from "../middlewares/upload";
// Importing necessary controllers for handling vendor routes

const vendorRouter = express.Router();
// Define vendor routes
vendorRouter.get("/profile", isAuthenticated, getVendorProfile); // Get vendor profile
vendorRouter.put("/profile", isAuthenticated, updateVendorProfile); // Update vendor profile
vendorRouter.put("/business", isAuthenticated,upload.single("logo"), updateVendorBusiness); // Update vendor business details

// Export the vendor router
export default vendorRouter;
// vendorRoute.ts
