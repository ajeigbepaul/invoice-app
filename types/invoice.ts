// src/types/invoice.ts
export type InvoiceStatus = 'paid' | 'pending' | 'draft';

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  postCode: string;
  country: string;
}

export interface Invoice {
  _id: string;
  invoiceId: string;
  createdAt: string;
  paymentDue: string;
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  total: number;
  userId: string;
}

export interface CreateInvoiceInput {
  description: string;
  paymentTerms: number;
  clientName: string;
  clientEmail: string;
  status: InvoiceStatus;
  senderAddress: Address;
  clientAddress: Address;
  items: InvoiceItem[];
  createdAt?: string;
  paymentDue?: string;
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {
  status?: InvoiceStatus;
}





