// src/components/common/EmptyState/EmptyState.tsx
import React from 'react';
import styles from './EmptyState.module.scss';
import Image from 'next/image';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title = 'There is nothing here',
  description = 'Create an invoice by clicking the New Invoice button and get started',
  icon,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {icon ? (
        icon
      ) : (
        <div className={styles.illustration}>
          {/* Empty state illustration */}
          <Image src='/emptyicon.svg' alt='Empty State' width={242} height={200}  />
          
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

