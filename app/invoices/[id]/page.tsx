"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import InvoiceDetail from "@/components/invoice/InvoiceDetail";
import GoBack from "@/components/common/GoBack";
import { UpdateInvoiceInput } from "@/types/invoice";
import styles from "./page.module.scss";
import EditInvoiceModal from "@/components/invoice/EditInvoiceModal/EditInvoiceModal";
import {
  useInvoice,
  useUpdateInvoice,
  useDeleteInvoice,
  useMarkAsPaid,
} from "@/hooks/useInvoices";
import Loader from "@/components/common/Loader";

export default function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: invoice, isLoading, error } = useInvoice(id);
  const { mutateAsync: updateInvoice, isPending: isUpdating } =
    useUpdateInvoice();
  const { mutateAsync: deleteInvoice, isPending: isDeleting } =
    useDeleteInvoice();
  const { mutateAsync: markAsPaid, isPending: isMarkingAsPaid } =
    useMarkAsPaid();

  const handleGoBack = () => {
    router.push("/invoices");
  };

  const handleDelete = async () => {
    try {
      await deleteInvoice(id);
      router.push("/invoices");
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleMarkAsPaid = async () => {
    if (invoice?.status === "pending") {
      try {
        await markAsPaid(id);
      } catch (error) {
        console.error("Error marking as paid:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loader size="medium" text="Loading invoice..." />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className={styles.page}>
        <GoBack onClick={handleGoBack} />
        <div style={{ padding: "20px", color: "#EC5757" }}>
          Failed to load invoice: {error?.message || "Invoice not found"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <GoBack onClick={handleGoBack} />

      <InvoiceDetail
        invoice={invoice}
        onDelete={handleDelete}
        onMarkAsPaid={handleMarkAsPaid}
        onEdit={() => setIsEditModalOpen(true)}
        isDeleting={isDeleting}
        isUpdating={isUpdating || isMarkingAsPaid}
      />

      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={async (updatedInvoice: UpdateInvoiceInput) => {
          try {
            await updateInvoice({ id: id, data: updatedInvoice });
            setIsEditModalOpen(false);
          } catch (error) {
            console.error("Error updating invoice:", error);
          }
        }}
        onDelete={handleDelete}
        invoice={invoice}
        isSubmitting={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
}
