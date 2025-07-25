import { v4 as uuidv4 } from "uuid";
import { Transaction } from "../models/transactionModel";
import { Product } from "../models/productModel";
import { Request, Response } from "express";

// ✅ Create Transaction
// ✅ Create Transaction (supports custom and product-based)
// export const createTransaction = async (req: Request, res: Response): Promise<void> => {
//   const { amount, productId, description } = req.body;
//   const vendorId = req.user?._id;

//   if (!amount || !description || !vendorId) {
//     res.status(400).json({
//       success: false,
//       message: "Amount, description, and vendor ID are required",
//     });
//     return;
//   }

//   try {
//     let isCustom = false;

//     // If productId is provided, validate it
//     if (productId) {
//       const product = await Product.findOne({ _id: productId, vendorId });
//       if (!product) {
//         res.status(404).json({
//           success: false,
//           message: "Product not found or does not belong to the vendor",
//         });
//         return;
//       }
//     } else {
//       isCustom = true;
//     }

//     const transaction = new Transaction({
//       amount,
//       vendorId,
//       productId: productId || undefined,
//       description,
//       transactionId: uuidv4(),
//       isCustom,
//     });

//     await transaction.save();

//     res.status(201).json({
//       success: true,
//       message: "Transaction created successfully",
//       transaction,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Unable to create transaction",
//       error: error instanceof Error ? error.message : String(error),
//     });
//   }
// };
// ✅ Get Single Transaction
export const getTransaction = async (req: Request, res: Response): Promise<void> => {
  const { transactionId } = req.params;
  const vendorId = req.user?._id;

  if (!transactionId) {
    res.status(400).json({ success: false, message: "Transaction ID is required" });
    return;
  }

  if (!vendorId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const transaction = await Transaction.findOne({ transactionId, vendorId });
    if (!transaction) {
      res.status(404).json({ success: false, message: "Transaction not found" });
      return;
    }

    res.status(200).json({ success: true, transaction });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve transaction",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// ✅ Get All Transactions for Vendor
export const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
  const vendorId = req.user?._id;

  if (!vendorId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const transactions = await Transaction.find({ vendorId })

    if (!transactions || transactions.length === 0) {
      res.status(404).json({ success: false, message: "No transactions found" });
      return;
    }

    res.status(200).json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve transactions",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

// ✅ Update Transaction Status
// export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
//   const { transactionId, status, transactionHash } = req.body;

//   if (status !== "expired" && !transactionHash) {
//     res.status(400).json({
//       success: false,
//       message: "Transaction hash is required for non-expired transactions",
//     });
//     return;
//   }

//   if (!transactionId || !status) {
//     res.status(400).json({
//       success: false,
//       message: "Transaction ID and status are required",
//     });
//     return;
//   }

//   try {
//     let updatedTransaction;

//     if (status === "expired") {
//       updatedTransaction = await Transaction.findOneAndUpdate(
//         { transactionId },
//         {
//           status,
//           transactionTime: new Date(),
//         },
//         { new: true }
//       );
//     } else {
//       updatedTransaction = await Transaction.findOneAndUpdate(
//         { transactionId },
//         {
//           status,
//           transactionHash,
//           transactionTime: new Date(),
//         },
//         { new: true }
//       );
//     }

//     if (!updatedTransaction) {
//       res.status(404).json({ success: false, message: "Transaction not found" });
//       return;
//     }

//     res.status(200).json({ success: true, transaction: updatedTransaction });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Unable to update transaction",
//       error: error instanceof Error ? error.message : String(error),
//     });
//   }
// };

// Transaction stats
export const getTransactionStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Transaction.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to retrieve transaction stats",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};