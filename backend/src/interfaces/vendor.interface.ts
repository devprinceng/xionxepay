// interfaces/vendor.interface.ts

import { Types } from "mongoose";

export interface IVendor {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  password?: string;

  businessName?: string;
  businessDescription?: string;
  category: string;

  metaAccountEmail?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  logo?: string | null;
  logoPublicId?: string | null;

  isVerified: boolean;
  vendorVerified: boolean;

  verifyOtp?: string | null;
  verifyOtpExpiresAt?: Date | null;

  resetOtp?: string | null;
  resetOtpExpiresAt?: Date | null;

  createdAt?: Date;
  updatedAt?: Date;
}
export interface IVendorCreate {
  name: string;
  email: string;
  password: string;

  businessName?: string;
  businessDescription?: string;
  category: string;

  metaAccountEmail?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;

  logo?: string | null;
  logoPublicId?: string | null;
}
export interface IVendorUpdate {
  vendorId: Types.ObjectId;

  name?: string;
  email?: string;
  password?: string;

  businessName?: string;
  businessDescription?: string;
  category?: string;

  metaAccountEmail?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;

  logo?: string | null;
  logoPublicId?: string | null;

  isVerified?: boolean;
}
export interface IVendorLogin {
  email: string;
  password: string;
}
export interface IVendorVerifyEmail {
  email: string;
  otp: string;
}
export interface IVendorResetPassword {
  email: string;
  otp: string;
  newPassword: string;
}
export interface IVendorSendResetOtp {
    email: string;
}
export interface IVendorSendVerifyOtp {
    email: string;
}
export interface IVendorProfile {
  name: string;
  email: string;
  phone: string;
}
export interface IVendorBusinessProfile {
  businessName: string;
  businessDescription: string;
  category: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  logo?: string | null;
    logoPublicId?: string | null;
    }
export interface IVendorUpdateProfile {
  name?: string;
  email?: string;
  phone?: string;
}
export interface IVendorUpdateBusiness {
  businessName?: string;
  businessDescription?: string;
  category?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  logo?: string | null;
  logoPublicId?: string | null;
}
export interface IVendorResponse {
  success: boolean;
  message?: string;
  vendor?: IVendor;
  vendorProfile?: IVendorProfile;
  businessProfile?: IVendorBusinessProfile;
}
