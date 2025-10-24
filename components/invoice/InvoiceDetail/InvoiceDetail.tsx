"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Invoice } from "@/types/invoice";
import { formatCurrency, formatDate } from "@/utils/formatters";
import InvoiceStatus from "../InvoiceStatus";
import Button from "../../common/Button";
import styles from "./InvoiceDetail.module.scss";
import DeleteModal from "@/components/common/DeleteModal/DeleteModal";

export interface InvoiceDetailProps {
  invoice: Invoice;
  onDelete: () => void;
  onMarkAsPaid: () => void;
  onEdit: () => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export default function InvoiceDetail({
  invoice,
  onDelete,
  onMarkAsPaid,
  onEdit,
  isDeleting = false,
  isUpdating = false,
}: InvoiceDetailProps) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = () => {
    onEdit();
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete();
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.container}>
      {/* Status Bar */}
      <div className={styles.statusBar}>
        <div className={styles.statusInfo}>
          <span className={styles.statusLabel}>Status</span>
          <InvoiceStatus status={invoice.status} />
        </div>

        <div className={styles.actions}>
          <Button variant="secondary" className={styles.editBtn} onClick={handleEdit}>
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            loading={isDeleting}
          >
            Delete
          </Button>
          {invoice.status !== "paid" && (
            <Button
              variant="primary"
              onClick={onMarkAsPaid}
              loading={isUpdating}
            >
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className={styles.details}>
        <div className={styles.header}>
          <div className={styles.invoiceInfo}>
            <h2 className={styles.invoiceId}>
              <span className={styles.hash}>#</span>
              {invoice.invoiceId}
            </h2>
            <p className={styles.description}>{invoice.description}</p>
          </div>

          <address className={styles.senderAddress}>
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </address>
        </div>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Invoice Date</span>
            <p className={styles.metaValue}>{formatDate(invoice.createdAt)}</p>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Payment Due</span>
            <p className={styles.metaValue}>{formatDate(invoice.paymentDue)}</p>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Bill To</span>
            <p className={styles.metaValue}>{invoice.clientName}</p>
            <address className={styles.clientAddress}>
              <p>{invoice.clientAddress.street}</p>
              <p>{invoice.clientAddress.city}</p>
              <p>{invoice.clientAddress.postCode}</p>
              <p>{invoice.clientAddress.country}</p>
            </address>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Sent to</span>
            <p className={styles.metaValue}>{invoice.clientEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className={styles.itemsTable}>
          <div className={styles.tableHeader}>
            <span className={styles.itemName}>Item Name</span>
            <span className={styles.qty}>QTY.</span>
            <span className={styles.price}>Price</span>
            <span className={styles.total}>Total</span>
          </div>

          <div className={styles.tableBody}>
            {invoice.items.map((item, index) => (
              <div key={index} className={styles.tableRow}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.qty}>{item.quantity}</span>
                <span className={styles.price}>
                  {formatCurrency(item.price)}
                </span>
                <span className={styles.total}>
                  {formatCurrency(item.total)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.tableFooter}>
            <span className={styles.footerLabel}>Amount Due</span>
            <span className={styles.footerTotal}>
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Deletion"
        
      >
        <div className={styles.modalContent}>
          <p className={styles.modalText}>
            Are you sure you want to delete invoice #{invoice.invoiceId}? This
            action cannot be undone.
          </p>
          <div className={styles.modalActions}>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              
              className={styles.cancel}

            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={isDeleting}
             

            >
              Delete
            </Button>
          </div>
        </div>
      </DeleteModal>
    </div>
  );
}
