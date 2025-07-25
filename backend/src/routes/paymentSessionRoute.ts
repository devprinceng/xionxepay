import express from "express";
import {
  startPaymentSession,
  getPaymentStatus,
  completePaymentSession,
  getActivePaymentSessions,
  getAllPaymentSessions,
} from "../controllers/paymentSessionController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const paymentSessionRouter = express.Router();

// Authenticated Vendor: start a payment session
paymentSessionRouter.post("/", isAuthenticated, startPaymentSession);

// Public: get session status (e.g., polling from frontend)
paymentSessionRouter.get("/status/:sessionId", getPaymentStatus);

// // Public: update session with email (before payment completes)
// paymentSessionRouter.put("/:sessionId", updatePaymentSession);

// Public: mark session as completed after payment hash is detected
paymentSessionRouter.post("/complete", completePaymentSession);

// Authenticated Vendor: get all their active (pending) sessions
paymentSessionRouter.get("/active", isAuthenticated, getActivePaymentSessions);

// Authenticated Vendor: get all sessions (pending/completed/expired)
paymentSessionRouter.get("/", isAuthenticated, getAllPaymentSessions);

export default paymentSessionRouter;
