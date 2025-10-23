"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GoBack from "@/components/common/GoBack";
import Button from "@/components/common/Button";
import { CreateInvoiceInput, InvoiceStatus } from "@/types/invoice";
import { generateInvoiceId, calculatePaymentDue } from "@/utils/formatters";
import styles from "./page.module.scss";

export default function NewInvoicePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateInvoiceInput>({
    description: "",
    paymentTerms: 30,
    clientName: "",
    clientEmail: "",
    status: "draft",
    senderAddress: {
      street: "19 Union Terrace",
      city: "London",
      postCode: "E1 3EZ",
      country: "United Kingdom",
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
  });

  const handleGoBack = () => {
    router.push("/invoices");
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (
    type: "sender" | "client",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value,
      },
    }));
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    // Recalculate total for this item
    if (field === "quantity" || field === "price") {
      newItems[index].total = newItems[index].quantity * newItems[index].price;
    }

    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
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

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      console.log("Creating invoice:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/invoices");
    } catch (error) {
      console.error("Error creating invoice:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    setIsLoading(true);

    try {
      const draftData = {
        ...formData,
        status: "draft" as InvoiceStatus,
      };

      // TODO: Replace with actual API call
      console.log("Saving as draft:", draftData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push("/invoices");
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <GoBack onClick={handleGoBack} />

      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>New Invoice</h1>

        {/* Bill From */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Bill From</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Street Address</label>
              <input
                type="text"
                value={formData.senderAddress.street}
                onChange={(e) =>
                  handleAddressChange("sender", "street", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>City</label>
              <input
                type="text"
                value={formData.senderAddress.city}
                onChange={(e) =>
                  handleAddressChange("sender", "city", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Post Code</label>
              <input
                type="text"
                value={formData.senderAddress.postCode}
                onChange={(e) =>
                  handleAddressChange("sender", "postCode", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Country</label>
              <input
                type="text"
                value={formData.senderAddress.country}
                onChange={(e) =>
                  handleAddressChange("sender", "country", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Bill To</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Client's Name</label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) =>
                  handleInputChange("clientName", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Client's Email</label>
              <input
                type="email"
                value={formData.clientEmail}
                onChange={(e) =>
                  handleInputChange("clientEmail", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Street Address</label>
              <input
                type="text"
                value={formData.clientAddress.street}
                onChange={(e) =>
                  handleAddressChange("client", "street", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>City</label>
              <input
                type="text"
                value={formData.clientAddress.city}
                onChange={(e) =>
                  handleAddressChange("client", "city", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Post Code</label>
              <input
                type="text"
                value={formData.clientAddress.postCode}
                onChange={(e) =>
                  handleAddressChange("client", "postCode", e.target.value)
                }
                required
              />
            </div>
            <div className={styles.field}>
              <label>Country</label>
              <input
                type="text"
                value={formData.clientAddress.country}
                onChange={(e) =>
                  handleAddressChange("client", "country", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className={styles.section}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Invoice Date</label>
              <input
                type="date"
                value={
                  formData.createdAt || new Date().toISOString().split("T")[0]
                }
                onChange={(e) => handleInputChange("createdAt", e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) =>
                  handleInputChange("paymentTerms", parseInt(e.target.value))
                }
                required
              >
                <option value={1}>Net 1 Day</option>
                <option value={7}>Net 7 Days</option>
                <option value={14}>Net 14 Days</option>
                <option value={30}>Net 30 Days</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Project Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                required
              />
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Item List</h2>
          <div className={styles.itemsTable}>
            <div className={styles.tableHeader}>
              <span>Item Name</span>
              <span>Qty.</span>
              <span>Price</span>
              <span>Total</span>
              <span></span>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className={styles.tableRow}>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleItemChange(index, "name", e.target.value)
                  }
                  placeholder="Item name"
                  required
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min="1"
                  required
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "price",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="0.01"
                  required
                />
                <span className={styles.total}>
                  ${(item.quantity * item.price).toFixed(2)}
                </span>
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className={styles.removeBtn}
                  >
                    <svg
                      width="13"
                      height="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                        fill="#888EB0"
                        fillRule="nonzero"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <button type="button" onClick={addItem} className={styles.addItemBtn}>
            + Add New Item
          </button>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleGoBack}>
            Discard
          </Button>

          <div className={styles.rightActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleSaveAsDraft}
              disabled={isLoading}
            >
              Save as Draft
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
