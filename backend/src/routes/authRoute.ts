import express from "express";
import {
  register,
  login,
  logout,
  sendVerifyOtp,
  verifyEmail,
  sendResetOTP,
  resetPassword,
} from "../controllers/authcontroller";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

// server/routes/authRoutes.js
// This file defines the authentication routes for user registration, login, logout, email verification, and password reset.
const authRouter = express.Router();

authRouter.post("/register", register); // import { register } from '../controllers/authController.js';
authRouter.post("/login", login); // import { login } from '../controllers/authController.js';
authRouter.post("/logout", logout); // import { logout } from '../controllers/authController.js';
authRouter.post("/sendVerifyOtp", sendVerifyOtp); // import { sendVerifyOtp } from '../controllers/authController.js';
authRouter.post("verify-account", verifyEmail); // import { verifyEmail } from '../controllers/authController.js';
authRouter.post("/send-reset-otp", sendResetOTP); // import { sendResetOTP } from '../controllers/authController.js';
authRouter.post("/reset-password", resetPassword); // import { resetPassword } from '../controllers/authController.js';

export default authRouter;
// authRoutes.js
