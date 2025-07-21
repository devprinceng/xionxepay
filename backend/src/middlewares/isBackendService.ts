import { Request, Response, NextFunction } from "express";

const BACKEND_API_KEY = process.env.API_KEY; // Store securely in env

export const isBackendService = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey === BACKEND_API_KEY) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Unauthorized access" });
  }
};