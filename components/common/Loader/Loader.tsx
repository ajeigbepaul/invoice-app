// src/components/common/Loader/Loader.tsx
import React from 'react';
import styles from './Loader.module.scss';

export interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({
  size = 'medium',
  fullScreen = false,
  text,
}: LoaderProps) {
  const content = (
    <>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <div className={styles.circle}></div>
      </div>
      {text && <p className={styles.text}>{text}</p>}
    </>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{content}</div>;
  }

  return <div className={styles.container}>{content}</div>;
}

// Skeleton Loader Component
export function SkeletonLoader({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  count = 1,
}: {
  width?: string;
  height?: string;
  borderRadius?: string;
  count?: number;
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={styles.skeleton}
          style={{
            width,
            height,
            borderRadius,
            marginBottom: count > 1 ? '8px' : '0',
          }}
        />
      ))}
    </>
  );
}

// src/components/common/Loader/index.ts
// export { default, SkeletonLoader } from './Loader';
// export type { LoaderProps } from './Loader';