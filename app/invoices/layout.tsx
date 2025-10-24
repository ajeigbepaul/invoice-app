"use client";

import React from "react";
import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Header from "@/components/layout/Header";
import styles from "./layout.module.scss";
import {
  InvoicesProvider,
  useInvoicesContext,
} from "@/context/InvoicesContext";

function InvoicesLayoutContent({ children }: { children: React.ReactNode }) {
  const { selectedStatus, setSelectedStatus, invoiceCount } =
    useInvoicesContext();
  const pathname = usePathname();

  // Hide header on invoice detail routes like /invoices/[id]
  const hideHeader = (() => {
    if (!pathname) return false;
    const parts = pathname.split("/").filter(Boolean); // remove empty
    // parts example: ["invoices", "1"] or ["invoices", "new"]
    return parts[0] === "invoices" && parts.length === 2 && parts[1] !== "new";
  })();

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {!hideHeader && (
          <Header
            invoiceCount={invoiceCount}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
          />
        )}
        <main className={styles.content}>{children}</main>
      </div>
    </DashboardLayout>
  );
}

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InvoicesProvider>
      <InvoicesLayoutContent>{children}</InvoicesLayoutContent>
    </InvoicesProvider>
  );
}
