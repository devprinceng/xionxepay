import express from "express";
import {
  getTransaction,
  getAllTransactions,
} from "../controllers/paymentController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const paymentRouter = express.Router();

// Authenticated Vendor: create new transaction
// paymentRouter.post("/", isAuthenticated, createTransaction);

// Authenticated Vendor: get all their transactions
paymentRouter.get("/", isAuthenticated, getAllTransactions);

// Authenticated Vendor: get transaction by ID
paymentRouter.get("/:transactionId", isAuthenticated, getTransaction);

// Public: update transaction (e.g. from webhook or system job)
// paymentRouter.put("/", updateTransaction);

export default paymentRouter;
