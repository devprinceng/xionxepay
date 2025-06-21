import jwt, {SignOptions} from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
      };
    }
  }
}

// Secret and options
const secret: jwt.Secret = process.env.JWT_SECRET || "abcdef1234";

export const isAuthenticated =  (req:Request, res:Response, next:NextFunction): void => {
    // Ensure cookies are present
    if (!req.cookies) {
        res.status(401).json({ success: false, message: "Not Authorized, cookies not found" });
    }

    // Extract token from cookies
    const { token } = req.cookies;

    // Check if token is present
    if (!token) {
        res.status(401).json({ success: false, message: "Not Authorized Login Again" });
    }

    // Check if JWT_SECRET is set
    if (!secret) {
        console.error("JWT_SECRET is not defined in environment variables.");
        res.status(500).json({ success: false, message: "Internal server error" });
    }

    // Verify the token using JWT
    try {
        const decoded = jwt.verify(token, secret);
        // Check if decoded token contains user ID
        if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
            res.status(401).json({ success: false, message: "Invalid token, please login again" });
        }
        // Attach user ID to request object for further use
        req.user = { _id: (decoded as jwt.JwtPayload).id }; // Use _id to match the user model's field
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ success: false, message: "Invalid token, please login again" });
    }
}


// server/middleware/isAuthenticated.js
// This middleware checks if the user is authenticated by verifying the JWT token
// If the token is valid, it attaches the user ID to the request object and calls next()
// If the token is invalid or missing, it responds with an error message
// This middleware is used to protect routes that require authentication
// It is typically used in routes that require user authentication, such as protected routes
// It ensures that only authenticated users can access certain routes