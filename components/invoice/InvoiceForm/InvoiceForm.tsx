import React, { useState } from "react";
import styles from "./InvoiceForm.module.scss";
import { Input } from "@/components/common";
import { Select } from "@/components/common";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceFormProps {
  initialData?: {
    invoiceNumber?: string;
    clientName?: string;
    clientEmail?: string;
    issueDate?: string;
    dueDate?: string;
    items?: InvoiceItem[];
    notes?: string;
  };
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    invoiceNumber: initialData?.invoiceNumber || "",
    clientName: initialData?.clientName || "",
    clientEmail: initialData?.clientEmail || "",
    issueDate: initialData?.issueDate || new Date().toISOString().split("T")[0],
    dueDate: initialData?.dueDate || "",
    items: initialData?.items || [
      { id: "1", description: "", quantity: 1, unitPrice: 0 },
    ],
    notes: initialData?.notes || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "quantity" || field === "unitPrice" ? +value : value,
    };
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
          id: Date.now().toString(),
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h2>Invoice Details</h2>
        <div className={styles.grid}>
          <Input
            label="Invoice Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Issue Date"
            name="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2>Client Information</h2>
        <div className={styles.grid}>
          <Input
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Client Email"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2>Line Items</h2>
        <div className={styles.items}>
          {formData.items.map((item, index) => (
            <div key={item.id} className={styles.item}>
              <Input
                label="Description"
                value={item.description}
                onChange={(e: { target: { value: string | number; }; }) =>
                  handleItemChange(index, "description", e.target.value)
                }
                placeholder="Item description"
              />
              <Input
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e: { target: { value: string | number; }; }) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                min="0"
                step="1"
              />
              <Input
                label="Unit Price"
                type="number"
                value={item.unitPrice}
                onChange={(e: { target: { value: string | number; }; }) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
                min="0"
                step="0.01"
              />
              {formData.items.length > 1 && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
        <button type="button" className={styles.addItemBtn} onClick={addItem}>
          + Add Item
        </button>
      </div>

      <div className={styles.section}>
        <h2>Notes</h2>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, notes: e.target.value }))
          }
          placeholder="Additional notes or payment instructions"
          className={styles.textarea}
          rows={4}
        />
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={styles.btnPrimary}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Invoice"}
        </button>
      </div>
    </form>
  );
};
