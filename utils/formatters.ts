// src/utils/formatters.ts
import { InvoiceItem } from "@/types/invoice";

/**
 * Generates a unique invoice ID
 * Format: INV-XXXXXX (where X is a random digit or letter)
 */
export function generateInvoiceId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "INV-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calculates the payment due date based on the creation date and payment terms
 * @param createdAt - ISO string date when invoice was created
 * @param paymentTerms - Number of days until payment is due
 * @returns ISO string of the payment due date
 */
export function calculatePaymentDue(
  createdAt: string,
  paymentTerms: number
): string {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + paymentTerms);
  return date.toISOString();
}

/**
 * Calculates the total amount of an invoice
 * @param items - Array of invoice items with quantity, price, and total
 * @returns Total amount for all items
 */
export function calculateTotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}
