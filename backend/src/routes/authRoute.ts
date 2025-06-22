import express from "express";
import {
  register,
  login,
  logout,
  verifyEmail,
  sendResetOTP,
  resetPassword,
} from "../controllers/authcontroller";
// Importing necessary controllers for handling authentication routes


import { isAuthenticated } from "../middlewares/isAuthenticated";

// server/routes/authRoutes.js
// This file defines the authentication routes for user registration, login, logout, email verification, and password reset.
const authRouter = express.Router();

authRouter.post("/register", register); // import { register } from '../controllers/authController.js';
authRouter.post("/login", login); // import { login } from '../controllers/authController.js';
authRouter.post("/logout", logout); // import { logout } from '../controllers/authController.js';
// authRouter.post("/sendVerifyOtp", isAuthenticated, sendVerifyOtp); // import { sendVerifyOtp } from '../controllers/authController.js';
authRouter.post("/verify-email", verifyEmail); // import { verifyEmail } from '../controllers/authController.js';
authRouter.post("/send-reset-otp", sendResetOTP); // import { sendResetOTP } from '../controllers/authController.js';
authRouter.post("/reset-password", resetPassword); // import { resetPassword } from '../controllers/authController.js';

export default authRouter;
// authRoutes.js
