"use client";

import React, { useState, useEffect } from "react";
import {
  Invoice,
  UpdateInvoiceInput,
  Address,
  InvoiceItem,
} from "@/types/invoice";
import { formatDate } from "@/utils/formatters";
import Modal from "@/components/common/Modal";
import DeleteModal from "@/components/common/DeleteModal/DeleteModal";
import deleteStyles from "@/components/common/DeleteModal/DeleteModal.module.scss";
import Button from "@/components/common/Button";
import styles from "./EditInvoiceModal.module.scss";
import { useUpdateInvoice, useDeleteInvoice } from "@/hooks/useInvoices";

export interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (invoice: UpdateInvoiceInput) => void;
  invoice: Invoice;
  isSubmitting?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function EditInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  invoice,
  isSubmitting = false,
  onDelete,
  isDeleting = false,
}: EditInvoiceModalProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutateAsync: updateInvoice, isPending: isUpdatingApi } = useUpdateInvoice();
  const { mutateAsync: deleteInvoiceApi, isPending: isDeletingApi } = useDeleteInvoice();
  const [formData, setFormData] = useState<UpdateInvoiceInput>({
    description: invoice.description,
    paymentTerms: invoice.paymentTerms,
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail,
    status: invoice.status,
    senderAddress: { ...invoice.senderAddress },
    clientAddress: { ...invoice.clientAddress },
    items: [...invoice.items],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        description: invoice.description,
        paymentTerms: invoice.paymentTerms,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        status: invoice.status,
        senderAddress: { ...invoice.senderAddress },
        clientAddress: { ...invoice.clientAddress },
        items: [...invoice.items],
      });
    }
  }, [isOpen, invoice]);

  const handleInputChange = (
    field: string,
    value: string | number,
    section?: "senderAddress" | "clientAddress" | "items"
  ) => {
    if (section === "senderAddress" || section === "clientAddress") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else if (section === "items") {
      setFormData((prev) => ({
        ...prev,
        items:
          prev.items?.map((item, index) =>
            index === 0 ? { ...item, [field]: value } : item
          ) || [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        {
          name: "",
          quantity: 1,
          price: 0,
          total: 0,
        },
      ],
    }));
  };

  const handleRemoveItem = (index: number) => {
    if (formData.items && formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: (prev.items || []).filter((_, i) => i !== index),
      }));
    }
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: (prev.items || []).map((item, i) => {
        if (i === index) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "price") {
            updatedItem.total = updatedItem.quantity * updatedItem.price;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total = (formData.items || []).reduce(
        (sum, item) => sum + item.total,
        0
      );
      const updatedData = {
        ...formData,
        total,
      };
      
      if (onSubmit) {
        onSubmit(updatedData);
      } else {
        await updateInvoice({ id: invoice._id, data: updatedData });
        onClose();
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        onDelete();
      } else {
        await deleteInvoiceApi(invoice._id);
        setShowDeleteModal(false);
        onClose();
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      description: invoice.description,
      paymentTerms: invoice.paymentTerms,
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail,
      status: invoice.status,
      senderAddress: { ...invoice.senderAddress },
      clientAddress: { ...invoice.clientAddress },
      items: [...invoice.items],
    });
    onClose();
  };

  const isLoading = isUpdatingApi || isSubmitting || isDeletingApi || isDeleting;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit #${invoice.invoiceId}`}
      size="large"
      showCloseButton={false}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.scrollableContent}>
          {/* Bill From Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Bill From</h3>
            <div className={styles.field}>
              <label className={styles.label}>Street Address</label>
              <input
                type="text"
                value={formData.senderAddress?.street || ""}
                onChange={(e) =>
                  handleInputChange("street", e.target.value, "senderAddress")
                }
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  value={formData.senderAddress?.city || ""}
                  onChange={(e) =>
                    handleInputChange("city", e.target.value, "senderAddress")
                  }
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Post Code</label>
                <input
                  type="text"
                  value={formData.senderAddress?.postCode || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "postCode",
                      e.target.value,
                      "senderAddress"
                    )
                  }
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  value={formData.senderAddress?.country || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "country",
                      e.target.value,
                      "senderAddress"
                    )
                  }
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Bill To</h3>
            <div className={styles.field}>
              <label className={styles.label}>Client's Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Client's Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  handleInputChange("clientEmail", e.target.value)
                }
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Street Address</label>
              <input
                type="text"
                value={formData.clientAddress?.street || ""}
                onChange={(e) =>
                  handleInputChange("street", e.target.value, "clientAddress")
                }
                className={styles.input}
                required
              />
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  value={formData.clientAddress?.city || ""}
                  onChange={(e) =>
                    handleInputChange("city", e.target.value, "clientAddress")
                  }
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Post Code</label>
                <input
                  type="text"
                  value={formData.clientAddress?.postCode || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "postCode",
                      e.target.value,
                      "clientAddress"
                    )
                  }
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Country</label>
                <input
                  type="text"
                  value={formData.clientAddress?.country || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "country",
                      e.target.value,
                      "clientAddress"
                    )
                  }
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </div>

          {/* Invoice Details Section */}
          <div className={styles.section}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Invoice Date</label>
                <input
                  type="date"
                  value={invoice.createdAt.split('T')[0]}
                  className={styles.input}
                  required
                  disabled
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    handleInputChange("paymentTerms", parseInt(e.target.value))
                  }
                  className={styles.input}
                  required
                >
                  <option value={1}>Net 1 Day</option>
                  <option value={7}>Net 7 Days</option>
                  <option value={14}>Net 14 Days</option>
                  <option value={30}>Net 30 Days</option>
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Project Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={styles.input}
                placeholder="e.g. Graphic Design"
                required
              />
            </div>
          </div>

          {/* Items Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Item List</h3>
            {(formData.items || []).map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Item Name</label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Qty.</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "price",
                        parseFloat(e.target.value) || 0
                      )
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.totalField}>
                  <label className={styles.label}>Total</label>
                  <div className={styles.totalDisplay}>
                    £ {item.total.toFixed(2)}
                  </div>
                </div>
                {(formData.items || []).length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className={styles.removeButton}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M12 4L4 12M4 4L12 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddItem}
              className={styles.addItemButton}
            >
              + Add New Item
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
           
            disabled={isLoading}
            className={styles.cancelBtn}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            variant="primary"
           
            loading={isUpdatingApi || isSubmitting}
          >
            Save Changes
          </Button>
        </div>
      </form>
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={`Confirm Delete`}
      >
        <div className={deleteStyles.content}>
          <p className={styles.description}>
            Are you sure you want to delete invoice #{invoice.invoiceId}? This
            action cannot be undone.
          </p>
          <div className={deleteStyles.actions}>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeletingApi || isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeletingApi || isDeleting}
            >
              Delete
            </Button>
          </div>
        </div>
      </DeleteModal>
    </Modal>
  );
}
