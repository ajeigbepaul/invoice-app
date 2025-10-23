// src/models/Invoice.ts
import mongoose, { Schema, Model } from 'mongoose';
import { Invoice, InvoiceItem, Address, InvoiceStatus } from '@/types/invoice';

export interface IInvoice extends Omit<Invoice, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const AddressSchema = new Schema<Address>(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    postCode: {
      type: String,
      required: [true, 'Post code is required'],
      trim: true,
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
  },
  { _id: false }
);

const InvoiceItemSchema = new Schema<InvoiceItem>(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    paymentDue: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    paymentTerms: {
      type: Number,
      required: [true, 'Payment terms are required'],
      enum: [1, 7, 14, 30],
      default: 30,
    },
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    clientEmail: {
      type: String,
      required: [true, 'Client email is required'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    status: {
      type: String,
      enum: ['paid', 'pending', 'draft'],
      default: 'draft',
      required: true,
    },
    senderAddress: {
      type: AddressSchema,
      required: [true, 'Sender address is required'],
    },
    clientAddress: {
      type: AddressSchema,
      required: [true, 'Client address is required'],
    },
    items: {
      type: [InvoiceItemSchema],
      required: [true, 'At least one item is required'],
      validate: {
        validator: function (items: InvoiceItem[]) {
          return items.length > 0;
        },
        message: 'Invoice must have at least one item',
      },
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total cannot be negative'],
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        const { __v, ...invoice } = ret;
        return invoice;
      },
    },
  }
);

// Indexes for faster queries
InvoiceSchema.index({ userId: 1, status: 1 });
InvoiceSchema.index({ invoiceId: 1 });
InvoiceSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total
InvoiceSchema.pre('save', function (next) {
  if (this.items && this.items.length > 0) {
    this.total = this.items.reduce((sum, item) => {
      item.total = item.quantity * item.price;
      return sum + item.total;
    }, 0);
  }
  next();
});

const InvoiceModel: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

export default InvoiceModel;