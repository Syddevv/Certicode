import React, { useState } from "react";
import "../styles/UpdatePaymentMethodModal.css";

export default function UpdatePaymentMethodModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    cardHolder: "John Doe",
    cardNumber: "1234 5678 9101 4242",
    expiry: "12/26",
    cvc: "123",
    isDefault: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

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

        <div className="upm-form-card">
          <div className="upm-field">
            <label className="upm-label" htmlFor="upm-card-holder">
              Card Holder *
            </label>
            <input
              id="upm-card-holder"
              name="cardHolder"
              type="text"
              className="upm-input"
              value={form.cardHolder}
              onChange={handleChange}
            />
          </div>

          <div className="upm-field">
            <label className="upm-label" htmlFor="upm-card-number">
              Card Number *
            </label>
            <div className="upm-card-number-wrap">
              <input
                id="upm-card-number"
                name="cardNumber"
                type="text"
                className="upm-input upm-input--with-badge"
                value={form.cardNumber}
                onChange={handleChange}
              />
              <span className="upm-card-badge" aria-hidden="true">
                VISA
              </span>
            </div>
          </div>

          <div className="upm-row">
            <div className="upm-field">
              <label className="upm-label" htmlFor="upm-expiry">
                Expiry *
              </label>
              <input
                id="upm-expiry"
                name="expiry"
                type="text"
                className="upm-input"
                value={form.expiry}
                onChange={handleChange}
              />
            </div>

            <div className="upm-field">
              <label className="upm-label" htmlFor="upm-cvc">
                CVC *
              </label>
              <input
                id="upm-cvc"
                name="cvc"
                type="text"
                className="upm-input"
                value={form.cvc}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <label className="upm-checkbox-row">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          <span>Set as default payment method</span>
        </label>

        <div className="upm-spacer" />

        <button type="button" className="upm-submit-btn" onClick={onClose}>
          Update
        </button>
      </div>
    </div>
  );
}
