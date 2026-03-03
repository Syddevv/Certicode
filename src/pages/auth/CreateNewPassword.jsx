import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import certicodeIcon from "../../assets/certicodeicon.png";
import "../../styles/CreateNewPassword.css";

const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;

const EyeIcon = ({ closed = false }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
    {closed ? (
      <path
        d="M4 20L20 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    ) : null}
  </svg>
);

const CreateNewPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // Add state for token and email
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  // ADD THIS useEffect FOR DEBUGGING
  useEffect(() => {
    // Log the raw token from URL
    const rawToken = searchParams.get('token');
    const rawEmail = searchParams.get('email');
    
    console.log("=== DEBUGGING RESET LINK ===");
    console.log("Raw token from URL:", rawToken);
    console.log("Raw email from URL:", rawEmail);
    console.log("Token length:", rawToken?.length);
    console.log("First 20 chars:", rawToken?.substring(0, 20));
    console.log("Full URL:", window.location.href);
    
    // Check if token might be URL encoded
    if (rawToken && rawToken.includes('%')) {
      console.log("Token appears to be URL encoded, decoding...");
      const decodedToken = decodeURIComponent(rawToken);
      console.log("Decoded token:", decodedToken);
      console.log("Decoded token length:", decodedToken.length);
    }
    
    // Set the token and email in state
    setToken(rawToken || "");
    setEmail(rawEmail || "");
    
    // Check if token looks valid (should be ~60 chars for Laravel default)
    if (!rawToken || rawToken.length < 20) {
      setMessage({ 
        type: "error", 
        text: "Invalid reset link. Please request a new password reset." 
      });
    }
  }, [searchParams]);

  const rules = useMemo(() => {
    const hasEightChars = newPassword.length >= 8;
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);
    return { hasEightChars, hasNumber, hasSpecialChar };
  }, [newPassword]);

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;
  const isValid =
    rules.hasEightChars &&
    rules.hasNumber &&
    rules.hasSpecialChar &&
    passwordsMatch;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Use the token and email from state
    if (!token || !email) {
      setMessage({ type: "error", text: "Invalid reset link. Please request a new password reset." });
      return;
    }

    if (!isValid) {
      setMessage({ type: "error", text: "Please satisfy the requirements and confirm both passwords." });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      // Log what we're sending
      console.log("Sending reset request with:", {
        email: email,
        token_length: token.length,
        token_preview: token.substring(0, 20) + '...'
      });

      const response = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          token: token,  // Send the raw token from URL
          email: email,
          password: newPassword,
          password_confirmation: confirmPassword
        })
      });

      const data = await response.json();
      console.log("Reset password response:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setMessage({ 
        type: "success", 
        text: "Password reset successful! Redirecting to login..." 
      });

      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      console.error('Reset password error:', error);
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to reset password. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-password-page">
      <div className="create-password-canvas">
        <div className="create-password-card">
          <img
            src={certicodeIcon}
            alt="Certicode logo"
            className="create-password-logo"
          />

          <h1 className="create-password-heading">Create new password</h1>
          <p className="create-password-subtitle">
            Your new password must be different from previous passwords.
          </p>

          {message.text && (
            <div className={`create-password-message create-password-message--${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="create-password-form">
            <label htmlFor="new-password" className="create-password-label">
              New Password
            </label>
            <div className="create-password-input-wrap">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                className="create-password-input"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength="8"
              />
              <button
                type="button"
                className="create-password-visibility"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon closed={showNewPassword} />
              </button>
            </div>

            <label htmlFor="confirm-password" className="create-password-label">
              Confirm New Password
            </label>
            <div className="create-password-input-wrap">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                className="create-password-input"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength="8"
              />
              <button
                type="button"
                className="create-password-visibility"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Hide confirm password" : "Show confirm password"
                }
              >
                <EyeIcon closed={showConfirmPassword} />
              </button>
            </div>

            <div className="create-password-rules">
              <p className="create-password-rules-title">YOUR PASSWORD MUST CONTAIN</p>
              <p
                className={`create-password-rule ${rules.hasEightChars ? "is-valid" : ""}`}
              >
                At least 8 characters
              </p>
              <p className={`create-password-rule ${rules.hasNumber ? "is-valid" : ""}`}>
                One number
              </p>
              <p
                className={`create-password-rule ${rules.hasSpecialChar ? "is-valid" : ""}`}
              >
                One special character
              </p>
            </div>

            {confirmPassword.length > 0 && !passwordsMatch ? (
              <p className="create-password-error">Passwords do not match.</p>
            ) : null}

            <button 
              type="submit" 
              className="create-password-button"
              disabled={loading || !isValid}
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <Link to="/login" className="create-password-back">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPassword;