// interfaces/product.interface.ts

import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  name: string;
  price: number;
  vendorId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IProductCreate {
  name: string;
  price: number;
}
export interface IProductUpdate {
  productId: Types.ObjectId;
  name?: string;
  price?: number;
}
export interface IProductDelete {
  productId: Types.ObjectId;
}
export interface IProductGetById {
  productId: Types.ObjectId;
}
export interface IProductGetAll {
  vendorId: Types.ObjectId;
}