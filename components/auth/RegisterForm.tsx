"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateRegistration, ValidationError } from "@/utils/validation";
import toast from "react-hot-toast";
import styles from "./form.module.css";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    // Check password match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      toast.error("Passwords do not match");
      return;
    }

    // Validate registration input
    const validation = validateRegistration(email, password, name);
    if (!validation.isValid) {
      const errorMap: Record<string, string> = {};
      validation.errors.forEach((err: ValidationError) => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Registration failed";
        toast.error(errorMsg);
        setErrors({ form: errorMsg });
        return;
      }

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1200);
    } catch (error) {
      toast.error("An error occurred during registration");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {errors.form && <div className={styles.formError}>{errors.form}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: "" });
          }}
          placeholder="John Doe"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          disabled={isLoading}
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
          placeholder="your@email.com"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          disabled={isLoading}
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
          placeholder="••••••••"
          className={`${styles.input} ${
            errors.password ? styles.inputError : ""
          }`}
          disabled={isLoading}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors({ ...errors, confirmPassword: "" });
          }}
          placeholder="••••••••"
          className={`${styles.input} ${
            errors.confirmPassword ? styles.inputError : ""
          }`}
          disabled={isLoading}
        />
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className={styles.button} disabled={isLoading}>
        {isLoading ? "Creating account..." : "Register"}
      </button>
    </form>
  );
}
