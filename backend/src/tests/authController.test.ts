import request from 'supertest';
import app from '../app'; // your Express app
import { Vendor } from '../models/vendorModel';
import * as nodemailer from '../config/nodemailer';

jest.mock('../models/vendorModel');
jest.mock('../config/nodemailer');

describe('Auth Controller', () => {
  const mockVendorSave = jest.fn();
  const fakeVendor = {
    _id: '123',
    email: 'test@example.com',
    password: '$2a$10$hashedpassword',
    isVerified: true,
    save: mockVendorSave,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'test@example.com' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if vendor already exists', async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue(fakeVendor);
      const res = await request(app).post('/api/auth/register').send({
        name: 'Test',
        email: 'test@example.com',
        password: '12345678',
        businessName: 'Test Biz',
        category: 'Services',
        metaAccountEmail: 'meta@example.com',
        phone: '1234567890',
        address: '123 Main St',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zip: '12345'
      });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com' });
      expect(res.status).toBe(400);
    });

    it('should return 400 if vendor does not exist', async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      const res = await request(app).post('/api/auth/login').send({ email: 'test@example.com', password: '123456' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /verify-email', () => {
    it('should return 400 if email or otp is missing', async () => {
      const res = await request(app).post('/api/auth/verify-email').query({ email: 'test@example.com' });
      expect(res.status).toBe(400);
    });
  });

  describe('POST /send-reset-otp', () => {
    it('should return 404 if email does not exist', async () => {
      (Vendor.findOne as jest.Mock).mockResolvedValue(null);
      const res = await request(app).post('/api/auth/send-reset-otp').send({ email: 'missing@example.com' });
      expect(res.status).toBe(404);
    });
  });

  describe('POST /reset-password', () => {
    it('should return 400 if fields are missing', async () => {
      const res = await request(app).post('/api/auth/reset-password').send({ email: 'test@example.com' });
      expect(res.status).toBe(400);
    });
  });
});
