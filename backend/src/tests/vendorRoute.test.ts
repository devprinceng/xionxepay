import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import vendorRouter from "../routes/vendorRoute";
import * as vendorController from "../controllers/vendorController";
import multer from "multer";

// Mock dependencies
jest.mock("../controllers/vendorController");
jest.mock("../middlewares/isAuthenticated", () => ({
  isAuthenticated: jest.fn((req: Request, _res: Response, next: NextFunction) => {
    req.user = { _id: "test-vendor-id" }; // simulate authenticated vendor
    next();
  }),
}));

jest.mock("../middlewares/upload", () => {
  const multer = require("multer");
  return multer({ storage: multer.memoryStorage() });
});

const app = express();
app.use(express.json());
app.use("/api/vendor", vendorRouter);

describe("Vendor Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /profile should call getVendorProfile", async () => {
    (vendorController.getVendorProfile as jest.Mock).mockImplementation((_req, res) =>
      res.status(200).json({ message: "Vendor profile retrieved" })
    );

    const res = await request(app).get("/api/vendor/profile");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Vendor profile retrieved");
    expect(vendorController.getVendorProfile).toHaveBeenCalled();
  });

  it("PUT /profile should call updateVendorProfile", async () => {
    (vendorController.updateVendorProfile as jest.Mock).mockImplementation((_req, res) =>
      res.status(200).json({ message: "Profile updated" })
    );

    const res = await request(app)
      .put("/api/vendor/profile")
      .send({ name: "New Name", phone: "1234567890" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Profile updated");
    expect(vendorController.updateVendorProfile).toHaveBeenCalled();
  });

  it("PUT /business should call updateVendorBusiness with file upload", async () => {
    (vendorController.updateVendorBusiness as jest.Mock).mockImplementation((_req, res) =>
      res.status(200).json({ message: "Business updated" })
    );

    const res = await request(app)
      .put("/api/vendor/business")
      .field("businessName", "TestBiz")
      .field("businessDescription", "BizDesc")
      .field("category", "Retail")
      .field("address", "123 Street")
      .field("city", "City")
      .field("state", "State")
      .field("country", "Country")
      .field("zip", "00000")
      .field("logo", "fakeurl")
      .field("logoPublicId", "fakeid")
      .attach("logo", Buffer.from("fake image"), {
        filename: "logo.png",
        contentType: "image/png",
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Business updated");
    expect(vendorController.updateVendorBusiness).toHaveBeenCalled();
  });
});
