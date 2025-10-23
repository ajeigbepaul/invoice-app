"use client";

import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import styles from "./page.module.css";

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Register</h1>
        <p className={styles.subtitle}>Create a new account</p>

        <RegisterForm />

        <p className={styles.footer}>
          Already have an account?{" "}
          <Link href="/auth/login" className={styles.link}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
