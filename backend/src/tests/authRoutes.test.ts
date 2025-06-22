// __tests__/authRoutes.test.ts

import request from "supertest";
import express from "express";
import authRouter from "../routes/authRoute";
import * as authController from "../controllers/authcontroller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

// Mock middleware and controller functions
jest.mock("../controllers/authcontroller");
jest.mock("../middlewares/isAuthenticated", () => ({
  isAuthenticated: jest.fn((req, res, next) => next()),
}));

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);

describe("Auth Routes", () => {
  it("POST /register should call register controller", async () => {
    const mockFn = jest.fn((_req, res) => res.status(201).json({ message: "register" }));
    (authController.register as jest.Mock).mockImplementation(mockFn);

    const res = await request(app)
      .post("/api/auth/register")
      .send({ name: "John", email: "john@example.com", password: "123" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("register");
    expect(authController.register).toHaveBeenCalled();
  });

  it("POST /login should call login controller", async () => {
    const mockFn = jest.fn((_req, res) => res.status(200).json({ message: "login" }));
    (authController.login as jest.Mock).mockImplementation(mockFn);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "john@example.com", password: "123" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("login");
    expect(authController.login).toHaveBeenCalled();
  });

  it("POST /logout should call logout controller", async () => {
    const mockFn = jest.fn((_req, res) => res.status(200).json({ message: "logout" }));
    (authController.logout as jest.Mock).mockImplementation(mockFn);

    const res = await request(app).post("/api/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("logout");
    expect(authController.logout).toHaveBeenCalled();
  });

  it("POST /verify-email should call verifyEmail controller", async () => {
    const mockFn = jest.fn((_req, res) => res.status(200).json({ message: "verified" }));
    (authController.verifyEmail as jest.Mock).mockImplementation(mockFn);

    const res = await request(app).post("/api/auth/verify-email").send({ otp: "123456", id: "abc" });

    expect(res.status).toBe(200);
    expect(authController.verifyEmail).toHaveBeenCalled();
  });

  it("POST /send-reset-otp should call sendResetOTP (auth required)", async () => {
    const mockFn = jest.fn((_req, res) => res.status(200).json({ message: "OTP sent" }));
    (authController.sendResetOTP as jest.Mock).mockImplementation(mockFn);

    const res = await request(app).post("/api/auth/send-reset-otp").send({ email: "john@example.com" });

    expect(res.status).toBe(200);
    expect(authController.sendResetOTP).toHaveBeenCalled();
  });

  it("POST /reset-password should call resetPassword (auth required)", async () => {
    const mockFn = jest.fn((_req, res) => res.status(200).json({ message: "Password reset" }));
    (authController.resetPassword as jest.Mock).mockImplementation(mockFn);

    const res = await request(app)
      .post("/api/auth/reset-password")
      .send({ id: "abc", otp: "123456", newPassword: "newPass" });

    expect(res.status).toBe(200);
    expect(authController.resetPassword).toHaveBeenCalled();
  });
});
