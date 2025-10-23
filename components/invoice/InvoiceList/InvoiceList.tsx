
import { Invoice } from '@/types/invoice';
import InvoiceCard from '../InvoiceCard';
import EmptyState from '../../common/EmptyState';
import { SkeletonLoader } from '../../common/Loader';
import styles from './InvoiceList.module.scss';

export interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
}

export default function InvoiceList({ invoices, loading = false }: InvoiceListProps) {
  if (loading) {
    return (
      <div className={styles.list}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <SkeletonLoader height="80px" borderRadius="8px" />
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.list}>
      {invoices.map((invoice) => (
        <InvoiceCard key={invoice._id} invoice={invoice} />
      ))}
    </div>
  );
}

;