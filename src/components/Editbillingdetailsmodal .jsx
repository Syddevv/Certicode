import React, { useState } from "react";
import "../styles/BuyerAccountSettings.css";
import ManagingPaymentMethod from "./ManagingPaymentMethod";
import UpdatePaymentMethodModal from "./UpdatePaymentMethodModal";

export default function EditBillingDetailsModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    companyName: "Horizon Tech Solutions LLC",
    companyAddress: "452 Marke Street, Ste 1200, San Francisco, CA 94104",
    country: "US",
    taxId: "99-8273645",
  });
  const [open, setOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenEditPaymentModal = () => {
    setIsEditPaymentOpen(true);
    if (isOpen) onClose();
  };

  if (!isOpen && !isEditPaymentOpen) return null;

  return (
    <>
      {isOpen && !isEditPaymentOpen && (
        <div className="ebd-overlay" role="presentation" onClick={onClose}>
          <div
            className="ebd-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ebd-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ebd-close" onClick={onClose} aria-label="Close">
              ✕
            </button>
            <h2 className="ebd-title" id="ebd-title">
              Edit Billing Details
            </h2>
            <p className="ebd-subtitle">
              Review your billing details to ensure uninterrupted service.
            </p>

            <hr className="ebd-divider" />
            <div className="ebd-form-card">
              <div className="ebd-field">
                <label className="ebd-label" htmlFor="companyName">
                  Company Name*
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  className="ebd-input"
                  type="text"
                  value={form.companyName}
                  onChange={handleChange}
                  placeholder="Company Name"
                />
              </div>
              <div className="ebd-field">
                <label className="ebd-label" htmlFor="companyAddress">
                  Company Address*
                </label>
                <input
                  id="companyAddress"
                  name="companyAddress"
                  className="ebd-input"
                  type="text"
                  value={form.companyAddress}
                  onChange={handleChange}
                  placeholder="Company Address"
                />
              </div>
              <div className="ebd-row">
                <div className="ebd-field">
                  <label className="ebd-label" htmlFor="country">
                    Country *
                  </label>
                  <div className="ebd-select-wrap">
                    <select
                      id="country"
                      name="country"
                      className="ebd-select"
                      value={form.country}
                      onChange={handleChange}
                    >
                      <option value="US">US</option>
                      <option value="CA">CA</option>
                      <option value="GB">GB</option>
                      <option value="AU">AU</option>
                      <option value="DE">DE</option>
                      <option value="FR">FR</option>
                      <option value="JP">JP</option>
                    </select>
                    <span className="ebd-chevron">▾</span>
                  </div>
                </div>

                <div className="ebd-field">
                  <label className="ebd-label" htmlFor="taxId">
                    Tax ID / VAT *
                  </label>
                  <input
                    id="taxId"
                    name="taxId"
                    className="ebd-input"
                    type="text"
                    value={form.taxId}
                    onChange={handleChange}
                    placeholder="Tax ID / VAT"
                  />
                </div>
              </div>
              <div className="ebd-field">
                <label className="ebd-label">Primary Method*</label>
                <div className="ebd-method-card">
                  <div className="ebd-visa-badge">VISA</div>
                  <div className="ebd-card-info">
                    <p className="ebd-card-name">Visa ending 4242</p>
                    <p className="ebd-card-expiry">Expires 12/29</p>
                  </div>
                  <button
                    type="button"
                    className="ebd-edit-link"
                    onClick={handleOpenEditPaymentModal}
                  >
                    Edit
                  </button>
                </div>
              </div>
              {/* add new payment */}
              <button
                type="button"
                className="ebd-add-method"
                onClick={() => setOpen(true)}
              >
                <span className="ebd-plus-icon">+</span>
                <span>Add a new payment method</span>
              </button>
            </div>
            <div className="ebd-spacer" />
            <button type="button" className="ebd-submit-btn" onClick={onClose}>
              Update Billing Details
            </button>
          </div>
        </div>
      )}
      <ManagingPaymentMethod open={open} setOpen={setOpen} />
      <UpdatePaymentMethodModal
        isOpen={isEditPaymentOpen}
        onClose={() => setIsEditPaymentOpen(false)}
      />
    </>
  );
}
