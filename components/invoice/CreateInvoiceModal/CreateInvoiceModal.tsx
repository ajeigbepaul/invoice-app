"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Invoice,
  CreateInvoiceInput,
  Address,
  InvoiceItem,
  InvoiceStatus,
} from "@/types/invoice";
import { formatDate } from "@/utils/formatters";
import { validateInvoiceInput } from "@/utils/validation";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useCreateInvoice } from "@/hooks/useInvoices";
import styles from "./CreateInvoiceModal.module.scss";
import { FaTrash } from "react-icons/fa";

export interface CreateInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (invoice: CreateInvoiceInput) => void;
  isSubmitting?: boolean;
  onSuccess?: () => void;
}

export default function CreateInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  onSuccess,
}: CreateInvoiceModalProps) {
  const router = useRouter();
  const { errors, setValidationErrors, clearErrors, getFieldError } =
    useFormValidation();
  const { mutateAsync: createInvoice, isPending } = useCreateInvoice();

  const initialFormData: CreateInvoiceInput = {
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "draft",
    createdAt: formatDate(new Date().toISOString()),
    senderAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    clientAddress: {
      street: "",
      city: "",
      postCode: "",
      country: "",
    },
    items: [
      {
        name: "",
        quantity: 1,
        price: 0,
        total: 0,
      },
    ],
  };

  const [formData, setFormData] = useState<CreateInvoiceInput>(initialFormData);

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
        items: prev.items.map((item, index) =>
          index === 0 ? { ...item, [field]: value } : item
        ),
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
        ...prev.items,
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
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
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
      items: prev.items.map((item, i) => {
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
      const invoiceData = {
        ...formData,
        status: "pending" as InvoiceStatus,
      };
      
      if (onSubmit) {
        onSubmit(invoiceData);
      } else {
        await createInvoice(invoiceData);
        setFormData(initialFormData);
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const draftData = {
        ...formData,
        status: "draft" as InvoiceStatus,
      };
      
      if (onSubmit) {
        onSubmit(draftData);
      } else {
        await createInvoice(draftData);
        setFormData(initialFormData);
        onClose();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleDiscard = () => {
    setFormData(initialFormData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Invoice"
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
                value={formData.senderAddress.street}
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
                  value={formData.senderAddress.city}
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
                  value={formData.senderAddress.postCode}
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
                  value={formData.senderAddress.country}
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
                value={formData.clientAddress.street}
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
                  value={formData.clientAddress.city}
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
                  value={formData.clientAddress.postCode}
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
                  value={formData.clientAddress.country}
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
                  value={formData.createdAt}
                  onChange={(e) =>
                    handleInputChange("createdAt", e.target.value)
                  }
                  className={styles.input}
                  required
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
            {formData.items.map((item, index) => (
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
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className={styles.removeButton}
                  >
                    <FaTrash className={styles.trashIcon} />
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
            onClick={handleDiscard}
            className={styles.discard}
            fullWidth
            disabled={isPending || isSubmitting}
          >
            Discard
          </Button>
          <Button
            type="button"
            variant="secondary"
            className={styles.draftButton}
            fullWidth
            loading={isPending}
            onClick={() => handleSaveAsDraft()}
          >
            Save as Draft
          </Button>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isPending || isSubmitting}
          >
            Save & Send
          </Button>
        </div>
      </form>
    </Modal>
  );
}
