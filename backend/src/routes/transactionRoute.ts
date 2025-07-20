import express from "express";
import {
  createTransaction,
  getTransaction,
  getAllTransactions,
  updateTransaction,
} from "../controllers/paymentController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const paymentRouter = express.Router();

// All routes are protected by authentication middleware
paymentRouter.post("/", isAuthenticated, createTransaction); // Create new transaction
paymentRouter.get("/", isAuthenticated, getAllTransactions); // Get all transactions for vendor
paymentRouter.get("/:transactionId", isAuthenticated, getTransaction); // Get single transaction by ID
paymentRouter.put("/", updateTransaction); // Update transaction status/hash

export default paymentRouter;