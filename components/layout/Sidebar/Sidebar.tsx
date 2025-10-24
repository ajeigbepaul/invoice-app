"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "../ThemeToggle";
import { getInitials } from "@/utils/formatters";
import styles from "./Sidebar.module.scss";
import Image from "next/image";
import { FaRegUserCircle } from "react-icons/fa";

export default function Sidebar() {
  const { data: session } = useSession();

  const handleLogout = () => {
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <Link href="/" className={styles.logo}>
          <Image src='/icon.svg' alt='Logo' width={38} height={38}  />
        </Link>
      </div>

      <div className={styles.bottom}>
        <ThemeToggle />
        <div className={styles.divider}></div>
        {session?.user && (
          <button
            onClick={handleLogout}
            className={styles.avatar}
            title="Click to logout"
          >
            {session.user.name ? getInitials(session.user.name) : <FaRegUserCircle />}
          </button>
        )}
      </div>
    </aside>
  );
}
