import transporter from "../config/nodemailer";
// import dotenv from "dotenv";
import { Transaction } from "../models/transactionModel";
import { Product } from "../models/productModel";
// dotenv.config();


export const createTransaction = async (req: any, res: any): Promise<void> => {
    const { amount, productId, customerEmail } = req.body;
    const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

    if (!amount || !productId || !customerEmail) {
        res.status(400).json({ success: false, message: "Amount, productId and customerEmail are required" });
        return;
    }

    // {
    //     amount: { type: Number, required: true }, 
    //     vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, 
    //     productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    //     status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" }, 
    //     description: { type: String, default: "" }, 
    //     transactionHash: { type: String, required: true, unique: true },
    //     url:{ type: String, default: "" }, // URL to the transaction details or receipt
    //   },

    try {
        // Check if the product exists and belongs to the vendor
        const product = await Product.findById(productId).populate("vendorId");
        if (!product || product.vendorId._id.toString() !== vendorId.toString()) {
            res.status(400).json({ success: false, message: "Product not found or does not belong to the vendor" });
            return;
        }
        const newTransaction = new Transaction({
            amount,
            vendorId,
            productId,
            status: "pending", // Initial status
            description: "Transaction initiated",
            transactionHash: "", // Example transaction hash, replace with actual hash if available
            url: "", // URL can be set later if needed
            
        });


        await newTransaction.save();

        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: customerEmail,
            subject: "Transaction initiated",
            text: `Your transaction of amount ${amount} is initiated.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ success: true, transaction: newTransaction, message: "Transaction created successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to create transaction", error: errorMessage });
    }
};