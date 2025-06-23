import e, { Request, Response } from "express";
import { Product } from "../models/productModel";
import dotenv from "dotenv";
dotenv.config();



export const createProduct = async (req: Request, res: Response): Promise<void> => {

    const { name, price} = req.body;
        if (!name || !price) {
            res.status(400).json({ success: false, message: "Name and price are required" });
            return;
        }

    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        // Check if the product already exists for the vendor
        const existingProduct = await Product.findOne({ name, vendor: vendorId });

        if (existingProduct) {
            res.status(400).json({ success: false, message: "Product already exists" });
            return;
        }

        const newProduct = new Product({
            name,
            price,
            vendorId: vendorId,
        });

        await newProduct.save();
        res.status(201).json({ success: true, product: newProduct, message:"Product created successfully" });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        res.status(500).json({ success: false, message: "Unable to create Product", error: errorMessage });
    }
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const products = await Product.find({ vendorId: vendorId });
        const { name, price } = products[0] || {};
        res.status(200).json({ success: true, products: products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to fetch products", error: error });
    }
}

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.body;
    if (!productId) {
        res.status(400).json({ success: false, message: "Product ID is required" });
        return;
    }
    try {
        
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const product = await Product.findOne({ _id: productId, vendorId: vendorId });

        if (!product) {
            res.status(400).json({ success: false, message: "Product not found" });
            return;
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to fetch product", error: error });
    }
}


export const updateProduct = async (req: Request, res: Response): Promise<void> => {
     const { productId } = req.body;
     if (!productId) {
        res.status(400).json({ success: false, message: "Product ID is required" });
        return;
    }
    try {
       
        const { name, price } = req.body;
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const product = await Product.findOneAndUpdate(
            { _id: productId, vendorId: vendorId },
            { name, price },
            { new: true }
        );

        if (!product) {
            res.status(400).json({ success: false, message: "Product not found" });
            return;
        }

        res.status(200).json({ success: true, product, message:"Product updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to update product", error: error });
    }
}

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { productId } = req.body;
    if (!productId) {
        res.status(400).json({ success: false, message: "Product ID is required" });
        return;
    }
    try {
        
        const vendorId = req.user?._id; // Assuming req.user is set by isAuthenticated middleware

        if (!vendorId) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }

        const product = await Product.findOneAndDelete({ _id: productId, vendorId: vendorId });

        if (!product) {
            res.status(400).json({ success: false, message: "Product not found" });
            return;
        }

        res.status(200).json({ success: true, message:"Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Unable to delete product", error: error });
    }
}

