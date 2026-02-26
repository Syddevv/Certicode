import { useEffect, useState } from "react";
import visaLogo from "../assets/visa logo.png";
import mastercardLogo from "../assets/mastercard logo.png";
import paypalLogo from "../assets/paypal logo.png";

import "../styles/ManagingPaymentMethod.css";

const DEFAULT_PAYMENT_METHODS = [
  {
    id: "visa",
    name: "Visa ending ****4242",
    expiry: "Expires 12/34",
    logo: "visa",
  },
  {
    id: "mastercard",
    name: "Mastercard ending ****4242",
    expiry: "Expires 12/34",
    logo: "mastercard",
  },
  {
    id: "paypal",
    name: "PayPal",
    expiry: null,
    logo: "paypal",
  },
];

function detectCardBrand(cardNumber) {
  const digits = String(cardNumber || "").replace(/\D/g, "");
  if (/^4\d{12}(\d{3})?$/.test(digits)) return "visa";
  if (/^(5[1-5]\d{14}|2(2[2-9]|[3-6]\d|7[01])\d{12}|2720\d{12})$/.test(digits))
    return "mastercard";
  return "visa";
}

function Logo({ type }) {
  const logoMap = {
    visa: visaLogo,
    mastercard: mastercardLogo,
    paypal: paypalLogo,
  };

  const src = logoMap[type];
  if (!src) return null;

  return <img className="ebd-payment-logo-img" src={src} alt={`${type} logo`} />;
}

export default function ManagingPaymentMethod({
  open,
  setOpen,
  selectedMethodId,
  onSelectMethod,
  editMethodId,
  addMode,
}) {
  const [paymentMethods, setPaymentMethods] = useState(DEFAULT_PAYMENT_METHODS);
  const [selected, setSelected] = useState(selectedMethodId || "visa");
  const [editingMethodId, setEditingMethodId] = useState(null);
  const [addingMethodOpen, setAddingMethodOpen] = useState(false);
  const [addMethodType, setAddMethodType] = useState("card");
  const [addForm, setAddForm] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    paypalEmail: "paypal-account@example.com",
  });
  const [addFormError, setAddFormError] = useState("");
  const [editForm, setEditForm] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    setDefault: false,
  });
  const [editFormError, setEditFormError] = useState("");

  useEffect(() => {
    if (!open) return;
    setSelected(selectedMethodId || paymentMethods[0]?.id || "visa");
  }, [open, selectedMethodId, paymentMethods]);

  useEffect(() => {
    if (!open) {
      setEditingMethodId(null);
      setAddingMethodOpen(false);
      setAddForm({
        cardNumber: "",
        expiry: "",
        cvc: "",
        paypalEmail: "paypal-account@example.com",
      });
      setAddFormError("");
    }
  }, [open]);

  useEffect(() => {
    if (!open || !editMethodId) return;
    const method = paymentMethods.find((item) => item.id === editMethodId);
    if (!method) return;
    const isPaypal = method.id === "paypal";
    setEditingMethodId(method.id);
    setEditForm({
      cardHolder: "John Doe",
      cardNumber: isPaypal ? "paypal-account@example.com" : "4242424242424242",
      expiry: isPaypal ? "" : "12/34",
      cvc: isPaypal ? "" : "123",
      setDefault: selected === method.id,
    });
  }, [open, editMethodId, selected]);

  useEffect(() => {
    if (!open || !addMode) return;
    setEditingMethodId(null);
    setAddingMethodOpen(true);
  }, [open, addMode]);

  if (!open) return null;

  const editingMethod = paymentMethods.find((item) => item.id === editingMethodId) || null;
  const isEditingPaypal = editingMethod?.id === "paypal";

  const openEditModal = (method) => {
    const isPaypal = method.id === "paypal";
    setEditingMethodId(method.id);
    setEditForm({
      cardHolder: "John Doe",
      cardNumber: isPaypal ? "paypal-account@example.com" : "4242424242424242",
      expiry: isPaypal ? "" : "12/34",
      cvc: isPaypal ? "" : "123",
      setDefault: selected === method.id,
    });
    setEditFormError("");
  };

  const closeEditModal = () => {
    if (editMethodId) {
      setEditingMethodId(null);
      setOpen(false);
      return;
    }
    setEditingMethodId(null);
    setEditFormError("");
  };

  const closeAddModal = () => {
    setAddingMethodOpen(false);
    setAddForm({
      cardNumber: "",
      expiry: "",
      cvc: "",
      paypalEmail: "paypal-account@example.com",
    });
    setAddFormError("");
    if (editMethodId || addMode) {
      setOpen(false);
    }
  };

  const handleAddFieldChange = (field, value) => {
    if (field === "cardNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      setAddForm((prev) => ({ ...prev, cardNumber: digitsOnly }));
      return;
    }

    if (field === "expiry") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        digitsOnly.length > 2
          ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
          : digitsOnly;
      setAddForm((prev) => ({ ...prev, expiry: formatted }));
      return;
    }

    if (field === "cvc") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
      setAddForm((prev) => ({ ...prev, cvc: digitsOnly }));
      return;
    }

    setAddForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFieldChange = (field, value) => {
    if (field === "cardNumber" && !isEditingPaypal) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
      setEditForm((prev) => ({ ...prev, cardNumber: digitsOnly }));
      setEditFormError("");
      return;
    }
    if (field === "expiry" && !isEditingPaypal) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 4);
      const formatted =
        digitsOnly.length > 2
          ? `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
          : digitsOnly;
      setEditForm((prev) => ({ ...prev, expiry: formatted }));
      setEditFormError("");
      return;
    }
    if (field === "cvc" && !isEditingPaypal) {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 3);
      setEditForm((prev) => ({ ...prev, cvc: digitsOnly }));
      setEditFormError("");
      return;
    }
    setEditForm((prev) => ({ ...prev, [field]: value }));
    setEditFormError("");
  };

  const handleUpdateMethod = () => {
    const isHolderValid = editForm.cardHolder.trim().length > 0;
    const isCardNumberValid = /^\d{16}$/.test(editForm.cardNumber);
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(editForm.expiry);
    const isCvcValid = /^\d{3}$/.test(editForm.cvc);
    const isPaypalEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.cardNumber);
    const isEditFormValid = isEditingPaypal
      ? isHolderValid && isPaypalEmailValid
      : isHolderValid && isCardNumberValid && isExpiryValid && isCvcValid;

    if (!isEditFormValid) {
      setEditFormError(
        isEditingPaypal
          ? "Card holder and a valid PayPal account email are required."
          : "Card holder, 16-digit card number, MM/YY expiry, and 3-digit CVC are required."
      );
      return;
    }

    if (editForm.setDefault && editingMethod) {
      setSelected(editingMethod.id);
      if (onSelectMethod) {
        onSelectMethod(editingMethod);
      }
    }
    closeEditModal();
  };

  const handleSelect = () => {
    const method = paymentMethods.find((item) => item.id === selected);
    if (method && onSelectMethod) {
      onSelectMethod(method);
    }
    setOpen(false);
  };

  const isCardNumberValid = /^\d{16}$/.test(addForm.cardNumber);
  const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(addForm.expiry);
  const isCvcValid = /^\d{3}$/.test(addForm.cvc);
  const isPaypalEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.paypalEmail);
  const canSaveNewMethod =
    addMethodType === "card"
      ? isCardNumberValid && isExpiryValid && isCvcValid
      : isPaypalEmailValid;
  const isEditHolderValid = editForm.cardHolder.trim().length > 0;
  const isEditCardNumberValid = /^\d{16}$/.test(editForm.cardNumber);
  const isEditExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(editForm.expiry);
  const isEditCvcValid = /^\d{3}$/.test(editForm.cvc);
  const isEditPaypalEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.cardNumber);
  const canUpdateMethod = isEditingPaypal
    ? isEditHolderValid && isEditPaypalEmailValid
    : isEditHolderValid && isEditCardNumberValid && isEditExpiryValid && isEditCvcValid;

  const handleSaveNewMethod = () => {
    if (!canSaveNewMethod) {
      setAddFormError(
        addMethodType === "card"
          ? "Enter a valid 16-digit card number, MM/YY expiry, and 3-digit CVC."
          : "Enter a valid PayPal account email."
      );
      return;
    }

    if (addMethodType === "card") {
      const brand = detectCardBrand(addForm.cardNumber);
      const last4 = addForm.cardNumber.slice(-4);
      const newMethod = {
        id: `${brand}-${Date.now()}`,
        name: `${brand === "mastercard" ? "Mastercard" : "Visa"} ending ****${last4}`,
        expiry: `Expires ${addForm.expiry}`,
        logo: brand,
      };
      setPaymentMethods((prev) => [...prev, newMethod]);
      setSelected(newMethod.id);
    } else {
      const newMethod = {
        id: `paypal-${Date.now()}`,
        name: "PayPal",
        expiry: null,
        logo: "paypal",
      };
      setPaymentMethods((prev) => [...prev, newMethod]);
      setSelected(newMethod.id);
    }

    setAddFormError("");
    closeAddModal();
  };

  return (
    <>
      {!editingMethod && !editMethodId && !addMode && !addingMethodOpen && (
        <div className="ebd-overlay" role="presentation" onClick={() => setOpen(false)}>
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

            <button className="ebd-add-link" onClick={() => setAddingMethodOpen(true)}>
              <span className="ebd-plus">+</span>
              <span>Add a new payment method</span>
            </button>

            <div className="ebd-methods-list">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`ebd-method-row${selected === method.id ? " selected" : ""}`}
                  onClick={() => setSelected(method.id)}
                  onDoubleClick={() => openEditModal(method)}
                  role="radio"
                  aria-checked={selected === method.id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(method.id);
                    }
                  }}
                >
                  <div className="ebd-method-logo">
                    <Logo type={method.logo} />
                  </div>
                  <div className="ebd-method-info">
                    <p className="ebd-method-name">{method.name}</p>
                    {method.expiry && <p className="ebd-method-expiry">{method.expiry}</p>}
                  </div>
                  <div className="ebd-radio">
                    {selected === method.id && <div className="ebd-radio-dot" />}
                  </div>
                </div>
              ))}
            </div>

            <button className="ebd-submit-btn" onClick={handleSelect}>
              Select
            </button>
          </div>
        </div>
      )}

      {editingMethod && (
        <div className="ebd-editpm-overlay" role="presentation" onClick={closeEditModal}>
          <div
            className="ebd-editpm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ebd-editpm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ebd-editpm-close" onClick={closeEditModal} aria-label="Close">
              ✕
            </button>

            <h3 className="ebd-editpm-title" id="ebd-editpm-title">
              Edit Payment Method
            </h3>
            <p className="ebd-editpm-subtitle">
              Please review and update your information as necessary.
            </p>

            <div className="ebd-editpm-card">
              <label className="ebd-editpm-label" htmlFor="edit-card-holder">
                Card Holder *
              </label>
              <input
                id="edit-card-holder"
                className="ebd-editpm-input"
                value={editForm.cardHolder}
                onChange={(e) => handleFieldChange("cardHolder", e.target.value)}
              />

              {isEditingPaypal ? (
                <>
                  <label className="ebd-editpm-label" htmlFor="edit-paypal-email">
                    PayPal Account Email *
                  </label>
                  <input
                    id="edit-paypal-email"
                    className="ebd-editpm-input"
                    value={editForm.cardNumber}
                    onChange={(e) => handleFieldChange("cardNumber", e.target.value)}
                  />
                </>
              ) : (
                <>
                  <label className="ebd-editpm-label" htmlFor="edit-card-number">
                    Card Number *
                  </label>
                  <div className="ebd-editpm-inputWrap">
                    <input
                      id="edit-card-number"
                      className="ebd-editpm-input"
                      value={editForm.cardNumber}
                      onChange={(e) => handleFieldChange("cardNumber", e.target.value)}
                    />
                    <span className="ebd-editpm-logoTag">
                      <Logo type={editingMethod.logo} />
                    </span>
                  </div>

                  <div className="ebd-editpm-row">
                    <div>
                      <label className="ebd-editpm-label" htmlFor="edit-expiry">
                        Expiry *
                      </label>
                      <input
                        id="edit-expiry"
                        className="ebd-editpm-input"
                        value={editForm.expiry}
                        onChange={(e) => handleFieldChange("expiry", e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="ebd-editpm-label" htmlFor="edit-cvc">
                        CVC *
                      </label>
                      <input
                        id="edit-cvc"
                        className="ebd-editpm-input"
                        value={editForm.cvc}
                        onChange={(e) => handleFieldChange("cvc", e.target.value)}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <label className="ebd-editpm-check">
              <input
                type="checkbox"
                checked={editForm.setDefault}
                onChange={(e) => handleFieldChange("setDefault", e.target.checked)}
              />
              <span>Set as default payment method</span>
            </label>

            {editFormError && <p className="ebd-editpm-error">{editFormError}</p>}

            <button
              className="ebd-editpm-update"
              onClick={handleUpdateMethod}
              disabled={!canUpdateMethod}
            >
              Update
            </button>
          </div>
        </div>
      )}

      {addingMethodOpen && (
        <div className="ebd-addpm-overlay" role="presentation" onClick={closeAddModal}>
          <div
            className="ebd-addpm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ebd-addpm-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="ebd-addpm-close" onClick={closeAddModal} aria-label="Close">
              ✕
            </button>

            <h3 className="ebd-addpm-title" id="ebd-addpm-title">
              Add a New Payment Method
            </h3>
            <p className="ebd-addpm-subtitle">
              Securely add your card or PayPal details for future transactions.
            </p>

            <div className={`ebd-addpm-option ${addMethodType === "card" ? "is-active" : ""}`}>
              <button
                className="ebd-addpm-optionHead"
                type="button"
                onClick={() => setAddMethodType("card")}
              >
                <span className="ebd-addpm-radio" aria-hidden="true" />
                <div>
                  <strong>Credit / Debit Card</strong>
                  <span>Visa, Master Card, Amex</span>
                </div>
              </button>

              {addMethodType === "card" && (
                <div className="ebd-addpm-cardFields">
                  <label>Card Number</label>
                  <input
                    placeholder="0000 0000 0000 0000"
                    value={addForm.cardNumber}
                    onChange={(e) => handleAddFieldChange("cardNumber", e.target.value)}
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                  <div className="ebd-addpm-row">
                    <div>
                      <label>Expiry</label>
                      <input
                        placeholder="MM/YY"
                        value={addForm.expiry}
                        onChange={(e) => handleAddFieldChange("expiry", e.target.value)}
                        inputMode="numeric"
                        autoComplete="cc-exp"
                      />
                    </div>
                    <div>
                      <label>CVC</label>
                      <input
                        placeholder="123"
                        value={addForm.cvc}
                        onChange={(e) => handleAddFieldChange("cvc", e.target.value)}
                        inputMode="numeric"
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              className={`ebd-addpm-option ebd-addpm-optionPayPal ${addMethodType === "paypal" ? "is-active" : ""}`}
              type="button"
              onClick={() => setAddMethodType("paypal")}
            >
              <span className="ebd-addpm-radio" aria-hidden="true" />
              <div>
                <strong>PayPal</strong>
                <span>Fast and secure checkout</span>
              </div>
            </button>

            {addMethodType === "paypal" && (
              <div className="ebd-addpm-cardFields">
                <label>PayPal Account Email</label>
                <input
                  placeholder="paypal-account@example.com"
                  value={addForm.paypalEmail}
                  onChange={(e) => handleAddFieldChange("paypalEmail", e.target.value)}
                  inputMode="email"
                  autoComplete="email"
                />
              </div>
            )}

            {addFormError && <p className="ebd-addpm-error">{addFormError}</p>}

            <button className="ebd-addpm-save" onClick={handleSaveNewMethod}>
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
}
