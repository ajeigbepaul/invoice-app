import { InvoiceStatus as Status } from '@/types/invoice';
import styles from './InvoiceStatus.module.scss';

export interface InvoiceStatusProps {
  status: Status;
}

export default function InvoiceStatus({ status }: InvoiceStatusProps) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      <span className={styles.dot}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

