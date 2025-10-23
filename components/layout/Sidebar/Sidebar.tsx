'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ThemeToggle from '../ThemeToggle';
import { getInitials } from '@/utils/formatters';
import styles from './Sidebar.module.scss';

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo}>
          <svg width="28" height="26" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.513 0C24.965 2.309 28 6.91 28 12.21 28 19.826 21.732 26 14 26S0 19.826 0 12.21C0 6.91 3.035 2.309 7.487 0L14 12.21z"
              fill="#9277FF"
            />
          </svg>
        </Link>
      </div>

      <div className={styles.bottom}>
        <ThemeToggle />
        <div className={styles.divider}></div>
        {session?.user && (
          <div className={styles.avatar}>
            {session.user.name ? getInitials(session.user.name) : 'U'}
          </div>
        )}
      </div>
    </aside>
  );
}

