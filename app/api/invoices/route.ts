// src/app/api/invoices/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import InvoiceModel from '@/models/Invoice';
import { ApiResponse } from '@/types/api';
import { validateInvoiceInput } from '@/utils/validation';
import {
  generateInvoiceId,
  calculatePaymentDue,
  calculateTotal,
} from '@/utils/formatters';
import { CreateInvoiceInput } from '@/types/invoice';

// GET /api/invoices - Get all invoices for the logged-in user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    await connectDB();

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Build query
    const query: any = { userId: session.user.id };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Fetch invoices
    const invoices = await InvoiceModel.find(query).sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: invoices,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to fetch invoices',
      },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    const body: CreateInvoiceInput = await request.json();

    // Validate input
    const validation = validateInvoiceInput(body);
    if (!validation.isValid) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: validation.errors[0].message,
        },
        { status: 400 }
      );
    }

    await connectDB();

    // Calculate totals for each item
    const itemsWithTotals = body.items.map((item) => ({
      ...item,
      total: item.quantity * item.price,
    }));

    // Calculate invoice total
    const total = calculateTotal(itemsWithTotals);

    // Generate invoice ID
    const invoiceId = generateInvoiceId();

    // Set created date if not provided
    const createdAt = body.createdAt || new Date().toISOString();

    // Calculate payment due date
    const paymentDue = calculatePaymentDue(createdAt, body.paymentTerms);

    // Create invoice
    const invoice = await InvoiceModel.create({
      invoiceId,
      createdAt,
      paymentDue,
      description: body.description.trim(),
      paymentTerms: body.paymentTerms,
      clientName: body.clientName.trim(),
      clientEmail: body.clientEmail.toLowerCase().trim(),
      status: body.status,
      senderAddress: body.senderAddress,
      clientAddress: body.clientAddress,
      items: itemsWithTotals,
      total,
      userId: session.user.id,
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: invoice,
        message: 'Invoice created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: 'Failed to create invoice',
      },
      { status: 500 }
    );
  }
}