import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import InvoiceModel from "@/models/Invoice";
import { ApiResponse } from "@/types/api";
import { validateInvoiceInput } from "@/utils/validation";
import { UpdateInvoiceInput } from "@/types/invoice";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const invoice = await InvoiceModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: invoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get invoice error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to fetch invoice",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const invoice = await InvoiceModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    if (invoice.status !== "draft") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Only draft invoices can be edited",
        },
        { status: 400 }
      );
    }

    const body: UpdateInvoiceInput = await request.json();

    if (body.items || body.description || body.clientName || body.clientEmail) {
      const validation = validateInvoiceInput({
        description: body.description || invoice.description,
        paymentTerms: body.paymentTerms || invoice.paymentTerms,
        clientName: body.clientName || invoice.clientName,
        clientEmail: body.clientEmail || invoice.clientEmail,
        status: body.status || invoice.status,
        senderAddress: body.senderAddress || invoice.senderAddress,
        clientAddress: body.clientAddress || invoice.clientAddress,
        items: body.items || invoice.items,
      });

      if (!validation.isValid) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: validation.errors[0].message,
            data: validation.errors,
          },
          { status: 400 }
        );
      }
    }

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      {
        ...body,
        ...(body.items && {
          items: body.items.map((item) => ({
            ...item,
            total: item.quantity * item.price,
          })),
        }),
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: updatedInvoice,
        message: "Invoice updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update invoice error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error.message || "Failed to update invoice",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const invoice = await InvoiceModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    await InvoiceModel.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Invoice deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete invoice error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to delete invoice",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const invoice = await InvoiceModel.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!invoice) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Invoice not found",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.status === "paid" && invoice.status !== "pending") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Only pending invoices can be marked as paid",
        },
        { status: 400 }
      );
    }

    const updatedInvoice = await InvoiceModel.findByIdAndUpdate(
      id,
      { status: body.status },
      { new: true }
    );

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: updatedInvoice,
        message: "Invoice status updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update invoice status error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to update invoice status",
      },
      { status: 500 }
    );
  }
}
