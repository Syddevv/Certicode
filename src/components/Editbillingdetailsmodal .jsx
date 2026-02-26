import React, { useState } from "react";
import "../styles/BuyerAccountSettings.css";
import ManagingPaymentMethod from "./ManagingPaymentMethod";
import VisaLogo from "../assets/visa logo.png";
import MastercardLogo from "../assets/mastercard logo.png";
import PaypalLogo from "../assets/paypal logo.png";

export default function EditBillingDetailsModal({
  isOpen,
  onClose,
  primaryMethod,
  onSelectPrimaryMethod,
}) {
  const [form, setForm] = useState({
    companyName: "Horizon Tech Solutions LLC",
    companyAddress: "452 Marke Street, Ste 1200, San Francisco, CA 94104",
    country: "US",
    taxId: "99-8273645",
  });
  const [open, setOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const primaryMethodId = primaryMethod?.id || "visa";
  const primaryMethodName = primaryMethod?.name || "Visa ending 4242";
  const primaryMethodExpiry = primaryMethod?.expiry || "Expires 12/34";
  const logoMap = {
    visa: VisaLogo,
    mastercard: MastercardLogo,
    paypal: PaypalLogo,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleOpenEditPaymentModal = () => {
    setIsEditPaymentOpen(true);
    if (isOpen) onClose();
  };

  const handleOpenAddPaymentModal = () => {
    setOpen(true);
    if (isOpen) onClose();
  };

  const isFormValid =
    form.companyName.trim().length > 0 &&
    form.companyAddress.trim().length > 0 &&
    form.country.trim().length > 0 &&
    form.taxId.trim().length > 0;

  const handleUpdateBillingDetails = () => {
    if (!isFormValid) {
      setFormError("Please fill in all required fields before updating.");
      return;
    }
    onClose();
  };

  if (!isOpen && !isEditPaymentOpen && !open) return null;

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
              Billing Details
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
                  <img
                    src={logoMap[primaryMethodId] || VisaLogo}
                    alt={`${primaryMethodId} logo`}
                    className="ebd-method-badge-img"
                  />
                  <div className="ebd-card-info">
                    <p className="ebd-card-name">{primaryMethodName}</p>
                    {primaryMethodId !== "paypal" && (
                      <p className="ebd-card-expiry">{primaryMethodExpiry}</p>
                    )}
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
                onClick={handleOpenAddPaymentModal}
              >
                <span className="ebd-plus-icon">+</span>
                <span>Add a new payment method</span>
              </button>
            </div>
            <div className="ebd-spacer" />
            {formError && <p className="ebd-form-error">{formError}</p>}
            <button
              type="button"
              className="ebd-submit-btn"
              onClick={handleUpdateBillingDetails}
              disabled={!isFormValid}
            >
              Update Billing Details
            </button>
          </div>
        </div>
      )}
      <ManagingPaymentMethod
        open={open}
        setOpen={setOpen}
        addMode
        selectedMethodId={primaryMethodId}
        onSelectMethod={onSelectPrimaryMethod}
      />
      <ManagingPaymentMethod
        open={isEditPaymentOpen}
        setOpen={setIsEditPaymentOpen}
        selectedMethodId={primaryMethodId}
        editMethodId={primaryMethodId}
        onSelectMethod={onSelectPrimaryMethod}
      />
    </>
  );
}
