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
          {/* <svg width="242" height="200" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
              <ellipse fill="#0C0E16" opacity=".06" cx="121" cy="185.5" rx="83" ry="14.5" />
              <g transform="translate(0 8)">
                <path
                  d="M96.45 112.8L68.8 90.5 96.45 68.2a5.6 5.6 0 0 0-.45-8.8l-52.8-33a5.6 5.6 0 0 0-6.3.45L.8 57.95A5.6 5.6 0 0 0 .8 66.8l36.1 31.1a5.6 5.6 0 0 0 6.3.45l52.8-33a5.6 5.6 0 0 0 .45-8.8z"
                  fill="#9277FF"
                />
                <ellipse fill="#373B53" cx="138.5" cy="140.5" rx="14.5" ry="14.5" />
                <path
                  d="M128 160c0 11.05 9.95 20 22 20h80c12.05 0 22-8.95 22-20s-9.95-20-22-20h-80c-12.05 0-22 8.95-22 20z"
                  fill="#888EB0"
                />
                <path
                  d="M230 80c-12.05 0-22 8.95-22 20s9.95 20 22 20 22-8.95 22-20-9.95-20-22-20zm0 32c-7.72 0-14-5.28-14-12s6.28-12 14-12 14 5.28 14 12-6.28 12-14 12z"
                  fill="#9277FF"
                />
              </g>
            </g>
          </svg> */}
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  );
}

