import request from "supertest";
import express, { Request, Response, NextFunction } from "express";
import * as vendorController from "../controllers/vendorController";
import { Vendor } from "../models/vendorModel";
import { cloudinary } from "../config/coudinary";

// Mock dependencies
jest.mock("../models/vendorModel");
jest.mock("../config/coudinary");

const mockVendor = {
  _id: "vendorId123",
  name: "Test Vendor",
  email: "vendor@example.com",
  phone: "1234567890",
  businessName: "TestBiz",
  businessDescription: "BizDesc",
  category: "Retail",
  address: "123 Street",
  city: "City",
  state: "State",
  country: "Country",
  zip: "00000",
  logo: "http://logo.url",
  logoPublicId: "logo_public_id",
  save: jest.fn(),
};

const fakeUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: mockVendor._id }; // Simulate authenticated vendor
  next();
};

const app = express();
app.use(express.json());
app.use(fakeUserMiddleware);
app.get("/profile", vendorController.getVendorProfile);
app.get("/business", vendorController.getBusinessProfile);
app.put("/profile", vendorController.updateVendorProfile);
app.put("/business", (req, res, next) => {
  // mock multer file upload
  req.file = {
    fieldname: "logo",
    originalname: "testfilename.jpg",
    encoding: "7bit",
    mimetype: "image/jpeg",
    size: 12345,
    destination: "/tmp",
    filename: "testfilename.jpg",
    path: "testpath",
    buffer: Buffer.from(""),
    stream: {} as any,
  };
  next();
}, vendorController.updateVendorBusiness);

describe("Vendor Profile Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getVendorProfile", () => {
    it("should return vendor profile", async () => {
      (Vendor.findById as jest.Mock).mockResolvedValue(mockVendor);
      const res = await request(app).get("/profile");
      expect(res.status).toBe(200);
      expect(res.body.vendorProfile.name).toBe("Test Vendor");
    });

    it("should return 404 if vendor not found", async () => {
      (Vendor.findById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get("/profile");
      expect(res.status).toBe(404);
    });
  });

  describe("getBusinessProfile", () => {
    it("should return business profile", async () => {
      (Vendor.findById as jest.Mock).mockResolvedValue(mockVendor);
      const res = await request(app).get("/business");
      expect(res.status).toBe(200);
      expect(res.body.businessProfile.businessName).toBe("TestBiz");
    });

    it("should return 404 if vendor not found", async () => {
      (Vendor.findById as jest.Mock).mockResolvedValue(null);
      const res = await request(app).get("/business");
      expect(res.status).toBe(404);
    });
  });

  describe("updateVendorProfile", () => {
    it("should update name and phone", async () => {
      (Vendor.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockVendor,
        name: "Updated Name",
        phone: "9999999999",
      });

      const res = await request(app).put("/profile").send({
        name: "Updated Name",
        phone: "9999999999",
      });

      expect(res.status).toBe(200);
      expect(res.body.vendor.name).toBe("Updated Name");
    });

    it("should return 400 if missing fields", async () => {
      const res = await request(app).put("/profile").send({
        name: "Updated Name",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("updateVendorBusiness", () => {
    it("should update business info with logo", async () => {
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
        secure_url: "https://cloudinary.com/logo.jpg",
        public_id: "cloudinary_id",
      });

      (Vendor.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockVendor,
        logo: "https://cloudinary.com/logo.jpg",
        logoPublicId: "cloudinary_id",
      });

      const res = await request(app).put("/business").send({
        businessName: "UpdatedBiz",
        businessDescription: "UpdatedDesc",
        category: "Tech",
        address: "New Address",
        city: "NewCity",
        state: "NewState",
        country: "NewCountry",
        zip: "12345",
        logo: "dummy",
        logoPublicId: "dummy",
      });

      expect(res.status).toBe(200);
      expect(res.body.vendor.logo).toContain("cloudinary.com");
    });

    it("should return 400 if file is not uploaded", async () => {
      const noFileApp = express();
      noFileApp.use(express.json());
      noFileApp.use(fakeUserMiddleware);
      noFileApp.put("/business", vendorController.updateVendorBusiness);

      const res = await request(noFileApp).put("/business").send({
        businessName: "Biz",
        businessDescription: "Desc",
        category: "Cat",
        address: "Addr",
        city: "City",
        state: "State",
        country: "Country",
        zip: "Zip",
        logo: "link",
        logoPublicId: "id",
      });

      expect(res.status).toBe(400);
    });
  });
});
