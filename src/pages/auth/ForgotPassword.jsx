import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-canvas">
        <div className="forgot-password-card">
          <h1 className="forgot-password-heading">Forgot your password?</h1>
          <p className="forgot-password-subtitle">
            Enter your email to receive a secure password reset link
          </p>

          <form onSubmit={handleSubmit} className="forgot-password-form">
            <label htmlFor="forgot-email" className="forgot-password-label">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder=" "
              className="forgot-password-input"
              required
            />

            {submitted ? (
              <p className="forgot-password-feedback">
                If your email exists, a reset link is on the way.
              </p>
            ) : null}

            <button type="submit" className="forgot-password-button">
              Send reset link
            </button>
          </form>

          <Link to="/login" className="forgot-password-back">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
