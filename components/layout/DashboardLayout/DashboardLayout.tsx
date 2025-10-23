// src/components/layout/DashboardLayout/DashboardLayout.tsx
'use client';

import React from 'react';
import Sidebar from '../Sidebar';
import styles from './DashboardLayout.module.scss';

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.container}>{children}</div>
      </main>
    </div>
  );
}

