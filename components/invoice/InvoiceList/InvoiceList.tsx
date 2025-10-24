
import { Invoice } from '@/types/invoice';
import InvoiceCard from '../InvoiceCard';
import EmptyState from '../../common/EmptyState';
import { SkeletonLoader } from '../../common/Loader';
import styles from './InvoiceList.module.scss';
import Emptyicon from '/emptyicon.svg'
export interface InvoiceListProps {
  invoices: Invoice[];
  loading?: boolean;
  isLoading?: boolean;
  error?: Error | null;
}

export default function InvoiceList({ invoices, loading = false, isLoading = false, error }: InvoiceListProps) {
  const isLoadingState = loading || isLoading;

  if (isLoadingState) {
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

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#EC5757' }}>
        <p>Failed to load invoices: {error.message}</p>
      </div>
    );
  }

  if (invoices.length === 0) {
    return <EmptyState  />;
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