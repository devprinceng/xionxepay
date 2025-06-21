import e, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, {SignOptions} from "jsonwebtoken";
import { Vendor } from "../models/vendorModel";
import transporter from "../config/nodemailer";
import dotenv from "dotenv";
dotenv.config();


// Secret and options
const secret: jwt.Secret = process.env.JWT_SECRET|| "abcdef1234";
const options: SignOptions = {
  expiresIn: Number(process.env.JWT_EXPIRY) || "7d",
};
export const vendorProfile = async (req: Request, res: Response): Promise<void> => { 
    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            res.status(404).json({ success: false, message: "Vendor not found" });
            return;
        }

        res.status(200).json({ success: true, vendor });
    } catch (error) {
        console.error("Error fetching vendor profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateVendorProfile = async (req: Request, res: Response): Promise<void> => {
    const { name, email, businessName, category, metaAccountEmail, phone, address, city, state, country, zip, businessDescription} = req.body;

    if (!name || !email || !businessName || !category || !metaAccountEmail || !phone || !address || !city || !state || !country || !zip || !businessDescription) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
    }

    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { name, email, businessName, category, metaAccountEmail, phone, address, city, state, country, zip, businessDescription},
            { new: true }
        );

        if (!updatedVendor) {
            res.status(404).json({ success: false, message: "Vendor not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateVendorLogo = async (req: Request, res: Response): Promise<void> => {
    const { logo } = req.body;

    if (!logo) {
        res.status(400).json({ success: false, message: "Logo URL is required" });
        return;
    }

    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { logo },
            { new: true }
        );

        if (!updatedVendor) {
            res.status(404).json({ success: false, message: "Vendor not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Logo updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor logo:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}