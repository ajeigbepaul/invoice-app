"use client";

import React from "react";
import { createPortal } from "react-dom";
import styles from "./DeleteModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export default function DeleteModal({
  isOpen,
  onClose,
  title,
  children,
}: Props) {
  if (!isOpen) return null;

  const content = (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {title && (
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
