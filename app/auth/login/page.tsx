"use client";

import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>
        <p className={styles.subtitle}>Sign in to your account</p>

        <LoginForm />

        <p className={styles.footer}>
          Don't have an account?{" "}
          <Link href="/auth/register" className={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
