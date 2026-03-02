import React, { useState, useEffect } from "react";
import "../styles/BuyerAccountSettings.css";
import ManagingPaymentMethod from "./ManagingPaymentMethod";
import UpdatePaymentMethodModal from "./UpdatePaymentMethodModal";
import { ProfileAPI } from "../services/ProfileAPI";
import { showErrorToast, showSuccessToast } from "../utils/toast";

export default function EditBillingDetailsModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    companyName: "",
    companyAddress: "",
    country: "",
    taxId: "",
  });
  const [open, setOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [primaryMethod, setPrimaryMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBillingDetails();
      fetchPrimaryPaymentMethod();
    }
  }, [isOpen]);

  const fetchBillingDetails = async () => {
    try {
      setLoading(true);
      const response = await ProfileAPI.getBillingDetails();
      if (response.data) {
        setForm({
          companyName: response.data.company_name || "",
          companyAddress: `${response.data.address_line1 || ""} ${response.data.address_line2 || ""}`.trim(),
          country: response.data.country || "",
          taxId: response.data.tax_id || "",
        });
      }
    } catch (error) {
      showErrorToast("Failed to load billing details");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrimaryPaymentMethod = async () => {
    try {
      const response = await ProfileAPI.getPaymentMethods();
      if (response.data) {
        const primary = response.data.find(method => method.is_default) || response.data[0];
        setPrimaryMethod(primary);
      }
    } catch (error) {
      console.error("Failed to load payment methods:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveBillingDetails = async () => {
    try {
      setSaving(true);
      
      const billingData = {
        company_name: form.companyName,
        address_line1: form.companyAddress,
        country: form.country,
        tax_id: form.taxId,
      };

      const response = await ProfileAPI.updateBillingDetails(billingData);
      showSuccessToast(response.message || "Billing details updated successfully");
      onClose();
    } catch (error) {
      showErrorToast(error.message || "Failed to update billing details");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEditPaymentModal = () => {
    setIsEditPaymentOpen(true);
    if (isOpen) onClose();
  };

  const handlePaymentMethodUpdated = () => {
    fetchPrimaryPaymentMethod();
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
            {loading ? (
              <div className="ebd-loading">Loading billing details...</div>
            ) : (
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
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
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
                    {primaryMethod ? (
                      <>
                        <div className="ebd-visa-badge">
                          {primaryMethod.card_brand?.toUpperCase() || "CARD"}
                        </div>
                        <div className="ebd-card-info">
                          <p className="ebd-card-name">
                            {primaryMethod.cardholder_name} •••• {primaryMethod.last_four}
                          </p>
                          <p className="ebd-card-expiry">
                            Expires {primaryMethod.expiry_month}/{primaryMethod.expiry_year}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="ebd-edit-link"
                          onClick={handleOpenEditPaymentModal}
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <p className="ebd-no-method">No payment method added</p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  className="ebd-add-method"
                  onClick={() => setOpen(true)}
                >
                  <span className="ebd-plus-icon">+</span>
                  <span>Add a new payment method</span>
                </button>
              </div>
            )}
            <div className="ebd-spacer" />
            <button 
              type="button" 
              className="ebd-submit-btn" 
              onClick={handleSaveBillingDetails}
              disabled={saving || loading}
            >
              {saving ? "Updating..." : "Update Billing Details"}
            </button>
          </div>
        </div>
      )}
      <ManagingPaymentMethod 
        open={open} 
        setOpen={setOpen} 
        onSuccess={fetchPrimaryPaymentMethod}
      />
      <UpdatePaymentMethodModal
        isOpen={isEditPaymentOpen}
        onClose={() => {
          setIsEditPaymentOpen(false);
          fetchPrimaryPaymentMethod();
        }}
        paymentMethod={primaryMethod}
        onSuccess={handlePaymentMethodUpdated}
      />
    </>
  );
}