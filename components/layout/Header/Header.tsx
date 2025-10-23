'use client';

import { useRouter } from 'next/navigation';
import { InvoiceStatus } from '@/types/invoice';
import InvoiceFilter from '@/components/invoice/InvoiceFilter';
import Button from '@/components/common/Button';
import styles from './Header.module.scss';

export interface HeaderProps {
  invoiceCount: number;
  selectedStatus: InvoiceStatus | 'all';
  onStatusChange: (status: InvoiceStatus | 'all') => void;
}

export default function Header({
  invoiceCount,
  selectedStatus,
  onStatusChange,
}: HeaderProps) {
  const router = useRouter();

  const handleNewInvoice = () => {
    router.push('/invoices/new');
  };

  const getInvoiceText = () => {
    if (invoiceCount === 0) return 'No invoices';
    if (invoiceCount === 1) return '1 invoice';
    return `There are ${invoiceCount} total invoices`;
  };

  const getStatusText = () => {
    if (selectedStatus === 'all') return '';
    return selectedStatus;
  };

  return (
    <header className={styles.header}>
      <div className={styles.info}>
        <h1 className={styles.title}>Invoices</h1>
        <p className={styles.subtitle}>
          {getStatusText() && (
            <span className={styles.statusText}>
              {getStatusText()}{' '}
            </span>
          )}
          {getInvoiceText()}
        </p>
      </div>

      <div className={styles.actions}>
        <InvoiceFilter
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
        />

        <Button
          variant="primary"
          onClick={handleNewInvoice}
          icon={
            <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z"
                fill="#FFF"
                fillRule="nonzero"
              />
            </svg>
          }
        >
          <span className={styles.buttonText}>
            New <span className={styles.hideOnMobile}>Invoice</span>
          </span>
        </Button>
      </div>
    </header>
  );
}

