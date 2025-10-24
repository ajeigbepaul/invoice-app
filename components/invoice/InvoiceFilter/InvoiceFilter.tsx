"use client";

import React, { useState, useRef, useEffect } from "react";
import { InvoiceStatus } from "@/types/invoice";
import styles from "./InvoiceFilter.module.scss";

export interface InvoiceFilterProps {
  selectedStatus: InvoiceStatus | "all";
  onStatusChange: (status: InvoiceStatus | "all") => void;
}

const filterOptions: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
];

export default function InvoiceFilter({
  selectedStatus,
  onStatusChange,
}: InvoiceFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (status: InvoiceStatus | "all") => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={handleToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className={styles.label}>Filter by status</span>

        <svg
          width="11"
          height="7"
          xmlns="http://www.w3.org/2000/svg"
          className={`${styles.arrow} ${isOpen ? styles.open : ""}`}
        >
          <path
            d="M1 1l4.228 4.228L9.456 1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            fillRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {filterOptions.map((option) => (
            <label key={option.value} className={styles.option}>
              <input
                type="checkbox"
                checked={selectedStatus === option.value}
                onChange={() => handleSelect(option.value)}
                className={styles.checkbox}
              />
              <span className={styles.checkmark}></span>
              <span className={styles.optionLabel}>{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
