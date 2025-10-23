// src/utils/validation.ts
import { CreateInvoiceInput, InvoiceItem, Address } from '@/types/invoice';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult {
  isValid: boolean;
  errors: ValidationError[];

  constructor(isValid: boolean = true, errors: ValidationError[] = []) {
    this.isValid = isValid;
    this.errors = errors;
  }
}

// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate address
export const validateAddress = (
  address: Address,
  prefix: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!address.street || address.street.trim().length === 0) {
    errors.push({ field: `${prefix}.street`, message: 'Street address is required' });
  }

  if (!address.city || address.city.trim().length === 0) {
    errors.push({ field: `${prefix}.city`, message: 'City is required' });
  }

  if (!address.postCode || address.postCode.trim().length === 0) {
    errors.push({ field: `${prefix}.postCode`, message: 'Post code is required' });
  }

  if (!address.country || address.country.trim().length === 0) {
    errors.push({ field: `${prefix}.country`, message: 'Country is required' });
  }

  return errors;
};

// Validate invoice item
export const validateInvoiceItem = (
  item: InvoiceItem,
  index: number
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const prefix = `items[${index}]`;

  if (!item.name || item.name.trim().length === 0) {
    errors.push({ field: `${prefix}.name`, message: 'Item name is required' });
  }

  if (!item.quantity || item.quantity < 1) {
    errors.push({
      field: `${prefix}.quantity`,
      message: 'Quantity must be at least 1',
    });
  }

  if (item.price === undefined || item.price < 0) {
    errors.push({
      field: `${prefix}.price`,
      message: 'Price must be 0 or greater',
    });
  }

  return errors;
};

// Validate invoice input
export const validateInvoiceInput = (
  input: CreateInvoiceInput
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate description
  if (!input.description || input.description.trim().length === 0) {
    errors.push({ field: 'description', message: 'Description is required' });
  } else if (input.description.length > 500) {
    errors.push({
      field: 'description',
      message: 'Description cannot exceed 500 characters',
    });
  }

  // Validate client name
  if (!input.clientName || input.clientName.trim().length === 0) {
    errors.push({ field: 'clientName', message: 'Client name is required' });
  }

  // Validate client email
  if (!input.clientEmail || input.clientEmail.trim().length === 0) {
    errors.push({ field: 'clientEmail', message: 'Client email is required' });
  } else if (!isValidEmail(input.clientEmail)) {
    errors.push({
      field: 'clientEmail',
      message: 'Please provide a valid email address',
    });
  }

  // Validate payment terms
  const validTerms = [1, 7, 14, 30];
  if (!validTerms.includes(input.paymentTerms)) {
    errors.push({
      field: 'paymentTerms',
      message: 'Payment terms must be 1, 7, 14, or 30 days',
    });
  }

  // Validate sender address
  const senderAddressErrors = validateAddress(input.senderAddress, 'senderAddress');
  errors.push(...senderAddressErrors);

  // Validate client address
  const clientAddressErrors = validateAddress(input.clientAddress, 'clientAddress');
  errors.push(...clientAddressErrors);

  // Validate items
  if (!input.items || input.items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  } else {
    input.items.forEach((item, index) => {
      const itemErrors = validateInvoiceItem(item, index);
      errors.push(...itemErrors);
    });
  }

  return new ValidationResult(errors.length === 0, errors);
};

// Validate registration input
export const validateRegistration = (
  email: string,
  password: string,
  name: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate email
  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  // Validate password
  if (!password || password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters long',
    });
  }

  // Validate name
  if (!name || name.trim().length < 2) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 2 characters long',
    });
  } else if (name.length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  return new ValidationResult(errors.length === 0, errors);
};

// Validate login input
export const validateLogin = (email: string, password: string): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: 'Please provide a valid email address' });
  }

  if (!password || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return new ValidationResult(errors.length === 0, errors);
};