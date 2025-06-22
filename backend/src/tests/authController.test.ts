import {
  register,
  login,
  logout,
  verifyEmail,
  sendResetOTP,
  resetPassword,
} from "../controllers/authcontroller";

import { Vendor } from "../models/vendorModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer";
import { Request, Response } from "express";

jest.mock("../models/vendorModel");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../config/nodemailer");

const mockRes = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  res.cookie = jest.fn();
  res.clearCookie = jest.fn();
  return res as Response;
};

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Response;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
    };
    res = mockRes();
    jest.clearAllMocks();
  });

  // --- REGISTER ---
  describe("register", () => {
    it("should return 400 if fields are missing", async () => {
      await register(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if vendor already exists", async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue(true);
      req.body = { email: "test@example.com", name: "Test", password: "123", businessName: "Store", category: "Retail", metaAccountEmail: "meta@test.com", phone: "123", address: "addr", city: "city", state: "state", country: "cty", zip: "0000" };
      await register(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should register successfully", async () => {
      const mockVendor = { _id: "1", email: "test@example.com", save: jest.fn() };
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      (Vendor as any).mockImplementation(() => mockVendor);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      (jwt.sign as jest.Mock).mockReturnValue("token123");
      (transporter.sendMail as jest.Mock).mockResolvedValue(true);
      req.body = { name: "Test", email: "test@example.com", password: "pass", businessName: "Biz", category: "Cat", metaAccountEmail: "meta@test.com", phone: "123", address: "addr", city: "city", state: "state", country: "cty", zip: "0000" };
      await register(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  // --- LOGIN ---
  describe("login", () => {
    it("should return 400 if fields are missing", async () => {
      await login(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if vendor not found", async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      req.body = { email: "not@found.com", password: "123456" };
      await login(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if password is invalid", async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue({ password: "hashed", isVerified: true });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      req.body = { email: "user@test.com", password: "wrong" };
      await login(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 400 if account not verified", async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue({ password: "hashed", isVerified: false });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      req.body = { email: "user@test.com", password: "123456" };
      await login(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should login successfully", async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue({ _id: "1", password: "hashed", isVerified: true });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("logintoken");
      req.body = { email: "user@test.com", password: "123456" };
      await login(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- LOGOUT ---
  describe("logout", () => {
    it("should clear cookie and logout", async () => {
      await logout(req as Request, res);
      expect(res.clearCookie).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- VERIFY EMAIL ---
  describe("verifyEmail", () => {
    it("should return 400 if missing params", async () => {
      req.query = {};
      await verifyEmail(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if vendor not found", async () => {
      req.query = { otp: "123456", id: "abc123" };
      (Vendor.findById as jest.Mock).mockResolvedValue(null);
      await verifyEmail(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should verify successfully", async () => {
      const vendor = {
        isVerified: false,
        verifyOtp: "123456",
        verifyOtpExpiresAt: Date.now() + 60000,
        save: jest.fn(),
      };
      (Vendor.findById as jest.Mock).mockResolvedValue(vendor);
      req.query = { otp: "123456", id: "abc123" };
      await verifyEmail(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- SEND RESET OTP ---
  describe("sendResetOTP", () => {
    it("should return 400 if no email", async () => {
      await sendResetOTP(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if vendor not found", async () => {
      req.body = { email: "none@test.com" };
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      await sendResetOTP(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should send OTP successfully", async () => {
      const vendor = { name: "Test", _id: "123", email: "test@test.com", save: jest.fn() };
      (Vendor.findOne as jest.Mock).mockResolvedValue(vendor);
      (transporter.sendMail as jest.Mock).mockResolvedValue(true);
      req.body = { email: "test@test.com" };
      await sendResetOTP(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- RESET PASSWORD ---
  describe("resetPassword", () => {
    it("should return 400 if missing fields", async () => {
      req.body = {};
      await resetPassword(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if vendor not found", async () => {
      req.body = { id: "abc", otp: "123456", newPassword: "pass" };
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      await resetPassword(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should reset password successfully", async () => {
      const vendor = {
        resetOtp: "123456",
        resetOtpExpiresAt: Date.now() + 60000,
        save: jest.fn(),
      };
      (Vendor.findOne as jest.Mock).mockResolvedValue(vendor);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      req.body = { id: "abc", otp: "123456", newPassword: "newPass" };
      await resetPassword(req as Request, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
