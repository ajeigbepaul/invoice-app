"use client";

import React from "react";
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

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <Header
          invoiceCount={invoiceCount}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
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
