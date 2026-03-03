import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/ForgotPassword.css";

const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });
      
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email: email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link');
      }
      
      setSubmitted(true);
      setMessage({ 
        type: "success", 
        text: "Password reset link sent to your email. Please check your inbox." 
      });
      
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to send reset link. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-canvas">
        <div className="forgot-password-card">
          <h1 className="forgot-password-heading">Forgot your password?</h1>
          <p className="forgot-password-subtitle">
            Enter your email to receive a secure password reset link
          </p>

          {message.text && (
            <div className={`forgot-password-message forgot-password-message--${message.type}`}>
              {message.text}
            </div>
          )}

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
              disabled={submitted}
            />

            {submitted ? (
              <p className="forgot-password-feedback">
                If your email exists, a reset link is on the way.
              </p>
            ) : null}

            <button 
              type="submit" 
              className="forgot-password-button"
              disabled={loading || submitted}
            >
              {loading ? "Sending..." : "Send reset link"}
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