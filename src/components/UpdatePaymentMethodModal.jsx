import React, { useState, useEffect } from "react";
import "../styles/UpdatePaymentMethodModal.css";
import { ProfileAPI } from "../services/ProfileAPI";
import { showErrorToast, showSuccessToast } from "../utils/toast";

export default function UpdatePaymentMethodModal({ isOpen, onClose, paymentMethod }) {
  const [form, setForm] = useState({
    cardholder_name: "",
    expiry_month: "",
    expiry_year: "",
    is_default: false,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (paymentMethod && isOpen) {
      setForm({
        cardholder_name: paymentMethod.cardholder_name || "",
        expiry_month: paymentMethod.expiry_month || "",
        expiry_year: paymentMethod.expiry_year || "",
        is_default: paymentMethod.is_default || false,
      });
    }
  }, [paymentMethod, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const response = await ProfileAPI.updatePaymentMethod(paymentMethod.id, form);
      showSuccessToast(response.message || "Payment method updated successfully");
      onClose();
    } catch (error) {
      showErrorToast(error.message || "Failed to update payment method");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this payment method?")) {
      return;
    }

    try {
      setDeleting(true);
      const response = await ProfileAPI.deletePaymentMethod(paymentMethod.id);
      showSuccessToast(response.message || "Payment method deleted successfully");
      onClose();
    } catch (error) {
      showErrorToast(error.message || "Failed to delete payment method");
    } finally {
      setDeleting(false);
    }
  };

  const handleSetDefault = async () => {
    try {
      setSaving(true);
      const response = await ProfileAPI.setDefaultPaymentMethod(paymentMethod.id);
      showSuccessToast(response.message || "Default payment method updated");
      onClose();
    } catch (error) {
      showErrorToast(error.message || "Failed to set default payment method");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !paymentMethod) return null;

  return (
    <div className="upm-overlay" role="presentation" onClick={onClose}>
      <div
        className="upm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="upm-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="upm-title" id="upm-title">
          Edit Payment Method
        </h2>
        <p className="upm-subtitle">
          Please review and update your information as necessary.
        </p>

        <hr className="upm-divider" />

        <div className="upm-card-info">
          <p><strong>Card:</strong> •••• •••• •••• {paymentMethod.last_four}</p>
        </div>

        <div className="upm-form-card">
          <div className="upm-field">
            <label className="upm-label" htmlFor="upm-card-holder">
              Card Holder *
            </label>
            <input
              id="upm-card-holder"
              name="cardholder_name"
              type="text"
              className="upm-input"
              value={form.cardholder_name}
              onChange={handleChange}
            />
          </div>

          <div className="upm-row">
            <div className="upm-field">
              <label className="upm-label" htmlFor="upm-expiry-month">
                Expiry Month *
              </label>
              <select
                id="upm-expiry-month"
                name="expiry_month"
                className="upm-select"
                value={form.expiry_month}
                onChange={handleChange}
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, "0");
                  return <option key={month} value={month}>{month}</option>;
                })}
              </select>
            </div>

            <div className="upm-field">
              <label className="upm-label" htmlFor="upm-expiry-year">
                Expiry Year *
              </label>
              <select
                id="upm-expiry-year"
                name="expiry_year"
                className="upm-select"
                value={form.expiry_year}
                onChange={handleChange}
              >
                <option value="">YYYY</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = (new Date().getFullYear() + i).toString();
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>
          </div>
        </div>

        <label className="upm-checkbox-row">
          <input
            type="checkbox"
            name="is_default"
            checked={form.is_default}
            onChange={handleChange}
          />
          <span>Set as default payment method</span>
        </label>

        <div className="upm-spacer" />

        <div className="upm-actions">
          <button 
            type="button" 
            className="upm-btn upm-btn--delete" 
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
          {!paymentMethod.is_default && (
            <button 
              type="button" 
              className="upm-btn upm-btn--default" 
              onClick={handleSetDefault}
              disabled={saving}
            >
              Set as Default
            </button>
          )}
          <button 
            type="button" 
            className="upm-btn upm-btn--update" 
            onClick={handleUpdate}
            disabled={saving}
          >
            {saving ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}