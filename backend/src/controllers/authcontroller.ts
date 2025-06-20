import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, {SignOptions} from "jsonwebtoken";
import { Vendor } from "../models/vendorModel";
import transporter from "../config/nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Secret and options
const secret: jwt.Secret = process.env.JWT_SECRET || "abcdef1234";
const options: SignOptions = {
  expiresIn: Number(process.env.JWT_EXPIRY) || "7d",
};

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password,businessName,category,metaAccountEmail,phone,address,city,state,country,zip } = req.body;


    if (!name || !email || !password || !businessName || !category || !metaAccountEmail || !phone || !address || !city || !state || !country || !zip) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            res.status(400).json({ success: false, message: "Vendor already exists" });
            return;
        }

        const newVendor = new Vendor({ name, email, password: hashedPassword,businessName,category,metaAccountEmail,phone,address,city,state,country,zip });
        await newVendor.save();

        const token = jwt.sign(
            { id: newVendor._id },
            secret,
            options
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Welcome to , ${process.env.APP_NAME}`,
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\n ${process.env.APP_NAME}`,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
        res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ success: false, message: "All fields are required" });
        return;
    }
    try {
        const vendor = await Vendor.findOne({ email });
        if (!vendor) {
            res.status(400).json({ success: false, message: "Invalid email or password" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, vendor.password || "");
        if (!isPasswordValid) {
            res.status(400).json({ success: false, message: "Invalid email or password" });
            return;
        }
        if (!vendor.isVerified) {
            res.status(400).json({ success: false, message: "Please verify your account first" });
            return;
        }
        const token = jwt.sign(
            { id: vendor._id },secret, options);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.status(200).json({ success: true, message: "User logged in successfully", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        res.status(200).json({ success: true, message: "User logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const sendVerifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { vendorID } = req.body;
        const vendor: any = await Vendor.findById(vendorID);

        if (!vendor) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }

        if (vendor.isAccountVerified) {
            res.status(400).json({ success: false, message: "Account already verified" });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        vendor.verifyOtp = otp;
        vendor.verifyOtpExpiresAt = expiresAt;
        await vendor.save();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: vendor.email,
            subject: `Verify your account`,
            text: `Your verification OTP is ${otp}. It is valid for 10 minutes.`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Verification OTP sent to ${vendor.email}`);
        res.status(200).json({ success: true, message: "Verification OTP sent successfully" });
    } catch (error) {
        console.error("Send verify OTP error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { vendorID, otp } = req.body;
    if (!vendorID || !otp) {
        res.status(400).json({ success: false, message: "Vendor ID and OTP are required" });
        return;
    }
    try {
        const vendor: any = await Vendor.findById(vendorID);
        if (!vendor) {
            res.status(404).json({ success: false, message: "Vendor not found" });
            return;
        }
        if (vendor.isAccountVerified) {
            res.status(400).json({ success: false, message: "Account already verified" });
            return;
        }
        if (vendor.verifyOtp !== otp || vendor.verifyOtp === null) {
            res.status(400).json({ success: false, message: "Invalid OTP" });
            return;
        }
        if (Date.now() > vendor.verifyOtpExpiresAt) {
            res.status(400).json({ success: false, message: "OTP expired" });
            return;
        }
        vendor.isAccountVerified = true;
        vendor.verifyOtp = null;
        vendor.verifyOtpExpiresAt = 0;
        await vendor.save();
        res.status(200).json({ success: true, message: "Account verified successfully" });
    } catch (error) {
        console.error("Email verification error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// export const isAuthenticated = async (req: Request, res: Response): Promise<void> => {
//     try {
//         res.status(200).json({ success: true, message: "Vendor is Authenticated " });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Internal server error" });
//     }
// };

export const sendResetOTP = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
    }

    try {
        const vendor: any = await Vendor.findOne({ email });

        if (!vendor) {
            res.status(404).json({ success: false, message: "Vendor does not exist" });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 10 * 60 * 1000;
        vendor.resetOtp = otp;
        vendor.resetOtpExpiresAt = expiresAt;
        await vendor.save();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: vendor.email,
            subject: `Password reset otp`,
            text: `Your OTP for resetting your password is ${otp}. It is valid for 10 minutes.`,
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Otp sent to your email" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        res.status(400).json({
            success: false,
            message: "Email , OTP and new password are required",
        });
        return;
    }

    try {
        const vendor: any = await Vendor.findOne({ email });

        if (!vendor) {
            res.status(404).json({ success: false, message: "Vendor not found" });
            return;
        }

        if (vendor.resetOtp === "" || vendor.resetOtp !== otp) {
            res.status(400).json({ success: false, message: "Invalid OTP" });
            return;
        }

        if (Date.now() > vendor.resetOtpExpiresAt) {
            res.status(400).json({ success: false, message: "OTP Expired" });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        vendor.password = hashedPassword;
        vendor.resetOtp = "";
        vendor.resetOtpExpiresAt = "";
        await vendor.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
