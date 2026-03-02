import { useState, useEffect } from "react";
import "../styles/ManagingPaymentMethod.css";
import UpdatePaymentMethodModal from "./UpdatePaymentMethodModal";
import { ProfileAPI } from "../services/ProfileAPI";
import { showErrorToast, showSuccessToast } from "../utils/toast";

function Logo({ type }) {
  if (type === "visa") {
    return <div className="ebd-visa-logo">VISA</div>;
  }
  if (type === "mastercard") {
    return (
      <div className="ebd-mastercard-logo">
        <div className="ebd-mc-circle red" />
        <div className="ebd-mc-circle orange" />
      </div>
    );
  }
  if (type === "paypal") {
    return <div className="ebd-paypal-logo">P</div>;
  }
  return null;
}

export default function ManagingPaymentMethod({ open, setOpen, onSuccess }) {
  const [selected, setSelected] = useState(null);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    cardholder_name: "",
    card_number: "",
    expiry_month: "",
    expiry_year: "",
    cvv: "",
    is_default: false,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      fetchPaymentMethods();
    }
  }, [open]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await ProfileAPI.getPaymentMethods();
      if (response.data) {
        setPaymentMethods(response.data);
        const defaultMethod = response.data.find(m => m.is_default) || response.data[0];
        if (defaultMethod) {
          setSelected(defaultMethod.id);
        }
      }
    } catch (error) {
      showErrorToast("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditPayment = (methodId) => {
    setSelected(methodId);
    setIsEditPaymentOpen(true);
    setOpen(false);
  };

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethod.cardholder_name || !newPaymentMethod.card_number || 
        !newPaymentMethod.expiry_month || !newPaymentMethod.expiry_year || !newPaymentMethod.cvv) {
      showErrorToast("Please fill in all fields");
      return;
    }

    try {
      setSaving(true);
      const response = await ProfileAPI.addPaymentMethod(newPaymentMethod);
      showSuccessToast(response.message || "Payment method added successfully");
      setShowAddForm(false);
      setNewPaymentMethod({
        cardholder_name: "",
        card_number: "",
        expiry_month: "",
        expiry_year: "",
        cvv: "",
        is_default: false,
      });
      fetchPaymentMethods();
      if (onSuccess) onSuccess();
    } catch (error) {
      showErrorToast(error.message || "Failed to add payment method");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPaymentMethod((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(" ");
  };

  const getCardBrand = (firstSix) => {
    if (firstSix?.startsWith('4')) return 'visa';
    if (firstSix?.startsWith('5')) return 'mastercard';
    return 'unknown';
  };

  return (
    (!open && !isEditPaymentOpen && !showAddForm) ? null : (
      <>
        {open && !isEditPaymentOpen && !showAddForm && (
          <div
            className="ebd-overlay"
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <div
              className="ebd-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ebd-title"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="ebd-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>

              <h2 className="ebd-title" id="ebd-title">
                Choose payment method
              </h2>
              <p className="ebd-subtitle">
                Please select your preferred payment method for your transaction.
              </p>

              <button className="ebd-add-link" onClick={() => setShowAddForm(true)}>
                <span className="ebd-plus">+</span>
                <span>Add a new payment method</span>
              </button>

              {loading ? (
                <div className="ebd-loading">Loading payment methods...</div>
              ) : (
                <div className="ebd-methods-list">
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`ebd-method-row${selected === method.id ? " selected" : ""}`}
                        onClick={() => handleOpenEditPayment(method.id)}
                        role="radio"
                        aria-checked={selected === method.id}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleOpenEditPayment(method.id);
                          }
                        }}
                      >
                        <div className="ebd-method-logo">
                          <Logo type={method.card_brand || getCardBrand(method.first_six)} />
                        </div>
                        <div className="ebd-method-info">
                          <p className="ebd-method-name">
                            {method.cardholder_name} •••• {method.last_four}
                          </p>
                          <p className="ebd-method-expiry">
                            Expires {method.expiry_month}/{method.expiry_year}
                          </p>
                          {method.is_default && (
                            <span className="ebd-default-badge">Default</span>
                          )}
                        </div>
                        <div className="ebd-radio">
                          {selected === method.id && <div className="ebd-radio-dot" />}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="ebd-no-methods">No payment methods added yet.</p>
                  )}
                </div>
              )}

              <button className="ebd-submit-btn" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}

        {showAddForm && (
          <div className="ebd-overlay" role="presentation" onClick={() => setShowAddForm(false)}>
            <div className="ebd-dialog" onClick={(e) => e.stopPropagation()}>
              <button className="ebd-close" onClick={() => setShowAddForm(false)}>✕</button>
              <h2 className="ebd-title">Add Payment Method</h2>
              
              <div className="ebd-form-card">
                <div className="ebd-field">
                  <label className="ebd-label">Cardholder Name</label>
                  <input
                    type="text"
                    name="cardholder_name"
                    className="ebd-input"
                    value={newPaymentMethod.cardholder_name}
                    onChange={handlePaymentChange}
                    placeholder="Name on card"
                  />
                </div>

                <div className="ebd-field">
                  <label className="ebd-label">Card Number</label>
                  <input
                    type="text"
                    name="card_number"
                    className="ebd-input"
                    value={formatCardNumber(newPaymentMethod.card_number)}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\s/g, "");
                      if (raw.length <= 16) {
                        handlePaymentChange({
                          target: { name: "card_number", value: raw }
                        });
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                  />
                </div>

                <div className="ebd-row">
                  <div className="ebd-field">
                    <label className="ebd-label">Expiry Month</label>
                    <select
                      name="expiry_month"
                      className="ebd-select"
                      value={newPaymentMethod.expiry_month}
                      onChange={handlePaymentChange}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, "0");
                        return <option key={month} value={month}>{month}</option>;
                      })}
                    </select>
                  </div>

                  <div className="ebd-field">
                    <label className="ebd-label">Expiry Year</label>
                    <select
                      name="expiry_year"
                      className="ebd-select"
                      value={newPaymentMethod.expiry_year}
                      onChange={handlePaymentChange}
                    >
                      <option value="">YYYY</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString();
                        return <option key={year} value={year}>{year}</option>;
                      })}
                    </select>
                  </div>

                  <div className="ebd-field">
                    <label className="ebd-label">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      className="ebd-input"
                      value={newPaymentMethod.cvv}
                      onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength="4"
                    />
                  </div>
                </div>

                <div className="ebd-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={newPaymentMethod.is_default}
                      onChange={handlePaymentChange}
                    />
                    Set as default payment method
                  </label>
                </div>

                <div className="ebd-actions">
                  <button className="ebd-btn ebd-btn--cancel" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </button>
                  <button 
                    className="ebd-btn ebd-btn--save" 
                    onClick={handleAddPaymentMethod}
                    disabled={saving}
                  >
                    {saving ? "Adding..." : "Add Payment Method"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <UpdatePaymentMethodModal
          isOpen={isEditPaymentOpen}
          onClose={() => {
            setIsEditPaymentOpen(false);
            setOpen(true);
            fetchPaymentMethods();
            if (onSuccess) onSuccess();
          }}
          paymentMethod={paymentMethods.find(m => m.id === selected)}
        />
      </>
    )
  );
}