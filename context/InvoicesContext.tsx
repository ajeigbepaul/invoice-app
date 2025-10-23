"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { InvoiceStatus } from "@/types/invoice";

interface InvoicesContextType {
  selectedStatus: InvoiceStatus | "all";
  setSelectedStatus: (status: InvoiceStatus | "all") => void;
  invoiceCount: number;
  setInvoiceCount: (count: number) => void;
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(
  undefined
);

export function InvoicesProvider({ children }: { children: ReactNode }) {
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | "all">(
    "all"
  );
  const [invoiceCount, setInvoiceCount] = useState(0);

  return (
    <InvoicesContext.Provider
      value={{
        selectedStatus,
        setSelectedStatus,
        invoiceCount,
        setInvoiceCount,
      }}
    >
      {children}
    </InvoicesContext.Provider>
  );
}

export function useInvoicesContext() {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error(
      "useInvoicesContext must be used within an InvoicesProvider"
    );
  }
  return context;
}
