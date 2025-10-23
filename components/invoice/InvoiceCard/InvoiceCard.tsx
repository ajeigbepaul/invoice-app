// src/components/invoice/InvoiceCard/InvoiceCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/utils/formatters';
import InvoiceStatus from '../InvoiceStatus';
import styles from './InvoiceCard.module.scss';

export interface InvoiceCardProps {
  invoice: Invoice;
}

export default function InvoiceCard({ invoice }: InvoiceCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/invoices/${invoice._id}`);
  };

  return (
    <div className={styles.card} onClick={handleClick} role="button" tabIndex={0}>
      <div className={styles.content}>
        <div className={styles.id}>
          <span className={styles.hash}>#</span>
          {invoice.invoiceId}
        </div>

        <div className={styles.dueDate}>
          Due {formatDate(invoice.paymentDue)}
        </div>

        <div className={styles.clientName}>{invoice.clientName}</div>

        <div className={styles.amount}>{formatCurrency(invoice.total)}</div>

        <div className={styles.status}>
          <InvoiceStatus status={invoice.status} />
        </div>

        <div className={styles.arrow}>
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

