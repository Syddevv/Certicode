import React, { useEffect, useRef, useState } from "react";
import "../styles/otpVerificationModal.css";
import logo from "../assets/certicodeicon.png";

const OTP_LENGTH = 6;

const OtpVerificationModal = ({
  isOpen,
  email = "",
  loading = false,
  onClose,
  onVerify,
  onResend,
}) => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!isOpen) return;
    setDigits(Array(OTP_LENGTH).fill(""));

    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
  }, [isOpen]);

  if (!isOpen) return null;

  const otpValue = digits.join("");

  const updateDigit = (index, value) => {
    const normalized = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = normalized;
    setDigits(nextDigits);

    if (normalized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        setDigits(nextDigits);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    event.preventDefault();
    const nextDigits = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, idx) => {
      nextDigits[idx] = char;
    });
    setDigits(nextDigits);

    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = () => {
    if (otpValue.length !== OTP_LENGTH || loading) return;
    if (typeof onVerify === "function") {
      onVerify(otpValue);
    }
  };

  return (
    <div
      className="otp-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose?.();
        }
      }}
    >
      <div className="otp-modal">
        <img src={logo} alt="Certicode" className="otp-modal-logo" />

        <h3>Email Verification</h3>

        <p>
          Enter the 6-digit OTP sent to
          <br />
          <strong>{email || "your Gmail account"}</strong>
        </p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="otp-input-box"
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              disabled={loading}
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>

        {typeof onResend === "function" && (
          <button
            type="button"
            className="otp-resend-btn"
            onClick={onResend}
            disabled={loading}
          >
            Resend OTP
          </button>
        )}

        <div className="otp-modal-actions">
          <button
            type="button"
            className="otp-cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="otp-verify-btn"
            onClick={handleVerify}
            disabled={loading || otpValue.length !== OTP_LENGTH}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>

        <small className="otp-modal-footer">
          Secure email verification by CertiCode Systems
        </small>
      </div>
    </div>
  );
};

export default OtpVerificationModal;

