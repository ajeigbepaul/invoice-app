"use client";

import React, { useEffect } from "react";
import InvoiceList from "@/components/invoice/InvoiceList";
import { useInvoicesContext } from "@/context/InvoicesContext";
import { useInvoices } from "@/hooks/useInvoices";

export default function InvoicesPage() {
  const { selectedStatus, setInvoiceCount } = useInvoicesContext();
  const { data: invoices = [], isLoading, error } = useInvoices(
    selectedStatus === "all" ? undefined : selectedStatus
  );

  useEffect(() => {
    setInvoiceCount(invoices.length);
  }, [invoices.length, setInvoiceCount]);

  return <InvoiceList invoices={invoices} isLoading={isLoading} error={error} />;
}
