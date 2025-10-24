"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InvoiceDetail from "@/components/invoice/InvoiceDetail";
import GoBack from "@/components/common/GoBack";
import { Invoice, InvoiceStatus, UpdateInvoiceInput } from "@/types/invoice";
import styles from "./page.module.scss";
import EditInvoiceModal from "@/components/invoice/EditInvoiceModal/EditInvoiceModal";

// Mock data - this will be replaced with API calls later
const mockInvoice: Invoice = {
  _id: "1",
  invoiceId: "RT3080",
  createdAt: "2021-08-18",
  paymentDue: "2021-08-19",
  description: "Re-branding",
  paymentTerms: 1,
  clientName: "Jensen Huang",
  clientEmail: "jensenh@mail.com",
  status: "paid",
  senderAddress: {
    street: "19 Union Terrace",
    city: "London",
    postCode: "E1 3EZ",
    country: "United Kingdom",
  },
  clientAddress: {
    street: "106 Kendell Street",
    city: "Sharrington",
    postCode: "NR24 5WQ",
    country: "United Kingdom",
  },
  items: [
    {
      name: "Brand Guidelines",
      quantity: 1,
      price: 1800.9,
      total: 1800.9,
    },
  ],
  total: 1800.9,
  userId: "user1",
};

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [invoice, setInvoice] = useState<Invoice>(mockInvoice);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleGoBack = () => {
    router.push("/invoices");
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    // TODO: Implement delete functionality
    console.log("Delete invoice:", invoice._id);
    setTimeout(() => {
      setIsDeleting(false);
      router.push("/invoices");
    }, 1000);
  };

  const handleMarkAsPaid = async () => {
    if (invoice.status === "pending") {
      setIsUpdating(true);
      // TODO: Implement mark as paid functionality
      setTimeout(() => {
        setInvoice((prev) => ({ ...prev, status: "paid" as InvoiceStatus }));
        setIsUpdating(false);
      }, 1000);
    }
  };

  return (
    <div className={styles.page}>
      <GoBack onClick={handleGoBack} />

      <InvoiceDetail
        invoice={invoice}
        onDelete={handleDelete}
        onMarkAsPaid={handleMarkAsPaid}
        onEdit={() => setIsEditModalOpen(true)}
        isDeleting={isDeleting}
        isUpdating={isUpdating}
      />

      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (updatedInvoice: UpdateInvoiceInput) => {
          try {
            setIsUpdating(true);
            // TODO: Implement update functionality
            console.log("Update invoice:", updatedInvoice);
            setInvoice((prev) => ({ ...prev, ...updatedInvoice }));
            setIsEditModalOpen(false);
          } catch (error) {
            console.error("Error updating invoice:", error);
          } finally {
            setIsUpdating(false);
          }
        }}
        invoice={invoice}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
