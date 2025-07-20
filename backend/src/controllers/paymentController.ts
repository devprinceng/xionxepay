import transporter from "../config/nodemailer";
import { v4 } from "uuid"; 
import { Transaction } from "../models/transactionModel";
import { Product } from "../models/productModel";



export const createTransaction = async (req: any, res: any): Promise<void> => {
    const { amount, productId, description } = req.body;
    const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

    if (!amount || !productId || !description) {
        res.status(400).json({ success: false, message: "Amount, productId and description are required" });
        return;
    }

    try {
        // Check if the product exists and belongs to the vendor
        const product = await Product.findById(productId).where("vendorId").equals(vendorId);
        if (!product || product.vendorId._id.toString() !== vendorId.toString()) {
            res.status(400).json({ success: false, message: "Product not found or does not belong to the vendor" });
            return;
        }
        const transactionId = v4(); // Generate a unique transaction ID
        const newTransaction = new Transaction({
            amount,
            vendorId,
            productId,
            description: description,
            transactionId: transactionId,
            transactionHash: "", // Example transaction hash, replace with actual hash if available
            
        });


        await newTransaction.save();

        res.status(201).json({ success: true, transaction: newTransaction, message: "Transaction created successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to create transaction", error: errorMessage });
    }
};

export const getTransaction = async (req: any, res: any): Promise<void> => {
    const { transactionId } = req.params;
    const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

    try {
        const transaction = await Transaction.findOne({ transactionId, vendorId });
        if (!transaction) {
            res.status(404).json({ success: false, message: "Transaction not found" });
            return;
        }

        res.status(200).json({ success: true, transaction });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to retrieve transaction", error: errorMessage });
    }
}   

export const getAllTransactions = async (req: any, res: any): Promise<void> => {
    const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

    try {
        const transactions = await Transaction.find({ vendorId }).populate("productId", "name price");
        res.status(200).json({ success: true, transactions });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to retrieve transactions", error: errorMessage });
    }
};  


export const updateTransaction = async (req: any, res: any): Promise<void> => {
    const { status, transactionId,transactionHash } = req.body;
    const transactionTime = new Date(Date.now()); // Current timestamp for transaction completion

    try {
        const transaction = await Transaction.findOneAndUpdate(
            { transactionId},
            { status, transactionHash, transactionTime },
            { new: true }
        );

        if (!transaction) {
            res.status(404).json({ success: false, message: "Transaction not found" });
            return;
        }

        res.status(200).json({ success: true, transaction });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to update transaction", error: errorMessage });
    }
};