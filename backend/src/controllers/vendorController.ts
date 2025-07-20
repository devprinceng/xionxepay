import e, { Request, Response } from "express";
import { cloudinary, storage } from "../config/coudinary";
import jwt, {SignOptions} from "jsonwebtoken";
import { Vendor } from "../models/vendorModel";
// import dotenv from "dotenv";
// dotenv.config();


// Secret and options
const secret: jwt.Secret = process.env.JWT_SECRET|| "abcdef1234";
const options: SignOptions = {
  expiresIn: Number(process.env.JWT_EXPIRY) || "7d",
};

interface UploadedImageResult {
    url: string;
    publicId: string;
}

interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

interface UploadedFile {
    path: string;
    filename: string;
}

const uploadCloudImage = async (file: UploadedFile): Promise<UploadedImageResult> => {
    try {
        const result: CloudinaryUploadResult = await cloudinary.uploader.upload(file.path, {
            folder: 'vendor_logo', // Specify the folder in Cloudinary
            public_id: file.filename, // Use the original filename as public ID
            resource_type: 'image', // Specify the resource type
        });
        return {
            url: result.secure_url, // The URL of the uploaded image
            publicId: result.public_id, // The public ID of the uploaded image
        };
    } catch (error: any) {
        throw new Error('Failed to upload image to Cloudinary: ' + error.message);
    }
};
export const getVendorProfile = async (req: Request, res: Response): Promise<void> => { 
    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            res.status(400).json({ success: false, message: "Vendor not found" });
            return;
        }
        const { name, email, phone} = vendor;
        // Return only the profile-related fields
        const vendorProfile = {
            name,
            email,
            phone,
        };

        res.status(200).json({ success: true, vendorProfile });
    } catch (error) {
        console.error("Error fetching vendor profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getBusinessProfile = async (req: Request, res: Response) :Promise<void> =>{

    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            res.status(400).json({ success: false, message: "Vendor not found" });
            return;
        }
        const { businessName, businessDescription, category, address, city, state, country, zip, logo, logoPublicId } = vendor;
        // Return only the business-related fields
        const businessProfile = {
            businessName,
            businessDescription,
            category,
            address,
            city,
            state,
            country,
            zip,
            logo,
            logoPublicId
        };

        res.status(200).json({ success: true, businessProfile });
    } catch (error) {
        console.error("Error fetching vendor business profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }

}

export const updateVendorProfile = async (req: Request, res: Response): Promise<void> => {
    const { name, phone} = req.body;

    if (!name || !phone) {
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
            { name, phone},
            { new: true }
        );

        if (!updatedVendor) {
            res.status(400).json({ success: false, message: "Vendor not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Profile updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor profile:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const updateVendorBusiness = async (req: Request, res: Response): Promise<void> => {
    const {businessName,businessDescription,category,address,city,state,country,zip} = req.body;

    if (!businessName || !businessDescription || !category || !address || !city || !state || !country || !zip) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
    }

    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware
        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ success: false, message: "Logo file is required" });
            return;
        }
        const { url, publicId } = await uploadCloudImage(req.file as UploadedFile);

        const updatedVendor = await Vendor.findByIdAndUpdate(
            vendorId,
            { businessName, businessDescription, category, address, city, state, country, zip, logo: url, logoPublicId: publicId },
            { new: true }
        );

        if (!updatedVendor) {
            res.status(400).json({ success: false, message: "Vendor not found" });
            return;
        }

        res.status(200).json({ success: true, message: "Vendor Business details updated successfully", vendor: updatedVendor });
    } catch (error) {
        console.error("Error updating vendor logo:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
