// models/invoice.interface.ts

export type InvoiceStatus = 'pending' | 'completed' | 'failed';

export interface InvoiceProduct {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  vendorName: string;
  amount: number; // auto-calculated from product totals or passed directly
  status: InvoiceStatus;
  description: string;
  transactionHash: string;
  url: string;
  time: string; // e.g. ISO string or formatted date
  products: InvoiceProduct[];
}
export interface Invoice {
  _id: string; // MongoDB ObjectId
  vendorId: string; // Reference to the vendor
  invoiceData: InvoiceData;
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}
export interface InvoiceCreate {
  vendorId: string; // Reference to the vendor
  invoiceData: InvoiceData;
}
export interface InvoiceUpdate {
  invoiceId: string; // MongoDB ObjectId of the invoice to update
  invoiceData: Partial<InvoiceData>; // Fields to update, can be partial
}