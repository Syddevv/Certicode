import { useState } from "react";

import "../styles/ManagingPaymentMethod.css";
const paymentMethods = [
  {
    id: "visa",
    name: "Visa ending ****4242",
    expiry: "Expires 12/26",
    logo: "visa",
  },
  {
    id: "mastercard",
    name: "Mastercard ending ****4242",
    expiry: "Expires 12/26",
    logo: "mastercard",
  },
  {
    id: "paypal",
    name: "PayPal",
    expiry: null,
    logo: "paypal",
  },
];

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

export default function ManagingPaymentMethod({ open, setOpen }) {
  const [selected, setSelected] = useState("visa");

  return (
    open && (
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

          <button className="ebd-add-link">
            <span className="ebd-plus">+</span>
            <span>Add a new payment method</span>
          </button>

          <div className="ebd-methods-list">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`ebd-method-row${selected === method.id ? " selected" : ""}`}
                onClick={() => setSelected(method.id)}
                role="radio"
                aria-checked={selected === method.id}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setSelected(method.id)}
              >
                <div className="ebd-method-logo">
                  <Logo type={method.logo} />
                </div>
                <div className="ebd-method-info">
                  <p className="ebd-method-name">{method.name}</p>
                  {method.expiry && (
                    <p className="ebd-method-expiry">{method.expiry}</p>
                  )}
                </div>
                <div className="ebd-radio">
                  {selected === method.id && <div className="ebd-radio-dot" />}
                </div>
              </div>
            ))}
          </div>

          <button className="ebd-submit-btn" onClick={() => setOpen(false)}>
            Select
          </button>
        </div>
      </div>
    )
  );
}
