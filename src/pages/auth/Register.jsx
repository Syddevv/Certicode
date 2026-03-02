import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginAndRegister.css";
import eye1 from "../../assets/eye1.png";
import eye2 from "../../assets/eye2.png";
import googleIcon from "../../assets/googleicon.png";
import facebookLogo from "../../assets/facebooklogo.png";
import certicodeIcon from "../../assets/certicodeicon.png";
import registerIllustration from "../../assets/Login Image.png";
import arrowLeft from "../../assets/arrowleft.png";
import { api } from "../../services/api";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import OtpVerificationModal from "../../components/OtpVerificationModal";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingUserData, setPendingUserData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePassword = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPassword = () =>
    setConfirmPasswordVisible(!confirmPasswordVisible);

  const registerUser = async (userData, otpCode = "") => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...userData,
        ...(otpCode ? { otp_code: otpCode } : {}),
      };

      const data = await api.register(payload);

      console.log("Registration successful:", data);
      showSuccessToast("Registration successful!");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      showErrorToast(error.message || "Registration failed. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showErrorToast("Passwords do not match");
      return;
    }
    if (!acceptTerms) {
      showErrorToast("Please accept the terms and conditions");
      return;
    }

    try {
      const userData = {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      };

      const requiresOtp = email.trim().toLowerCase().endsWith("@gmail.com");

      if (requiresOtp) {
        try {
          setIsSubmitting(true);
          await api.sendRegistrationOtp(email.trim().toLowerCase());
          setPendingUserData(userData);
          setIsOtpModalOpen(true);
          showSuccessToast("OTP sent to your Gmail address.");
        } finally {
          setIsSubmitting(false);
        }
        return;
      }

      const registered = await registerUser(userData);
      if (registered) {
        window.location.href = "/login";
      }
    } catch (error) {
      showErrorToast(error.message || "Registration failed. Please try again.");
    }
  };

  const handleOtpVerify = async (otpCode) => {
    if (!pendingUserData) {
      showErrorToast("Registration data is missing. Please try again.");
      return;
    }

    const registered = await registerUser(pendingUserData, otpCode);
    if (registered) {
      setIsOtpModalOpen(false);
      setPendingUserData(null);
      window.location.href = "/login";
    }
  };

  const handleOtpClose = () => {
    if (isSubmitting) return;
    setIsOtpModalOpen(false);
    setPendingUserData(null);
  };

  const handleResendOtp = async () => {
    const otpEmail = pendingUserData?.email || email;
    if (!otpEmail) {
      showErrorToast("Email is missing for OTP resend.");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.sendRegistrationOtp(otpEmail.trim().toLowerCase());
      showSuccessToast("A new OTP has been sent.");
    } catch (error) {
      showErrorToast(error.message || "Failed to resend OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await api.googleRedirect();
    } catch (error) {
      showErrorToast("Google login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsSubmitting(true);
    try {
      await api.facebookRedirect();
    } catch (error) {
      showErrorToast("Facebook login failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page login-page register-page">
      <div className="login-container">
        <div className="left-panel">
          <div className="login-header">
            <h1 className="login-title">Sign Up</h1>
            <p className="login-subtitle">
              Let&apos;s start your journey with CertiCode!
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="password-wrapper">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePassword}
                  disabled={isSubmitting}
                >
                  <img
                    src={passwordVisible ? eye2 : eye1}
                    alt="Toggle password visibility"
                    className="eye-icon-img"
                  />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <div className="password-wrapper">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  id="confirm-password"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPassword}
                  disabled={isSubmitting}
                >
                  <img
                    src={confirmPasswordVisible ? eye2 : eye1}
                    alt="Toggle password visibility"
                    className="eye-icon-img"
                  />
                </button>
              </div>
            </div>

            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isSubmitting}
                  required
                />
                <span className="terms-text">
                  By signing the account, you accept our{" "}
                  <a href="#">Terms &amp; Conditions</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Processing...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <div className="divider">
              <span className="divider-text">Or Continue With</span>
            </div>

            <div className="social-buttons">
              <button
                type="button"
                className="social-button"
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                <img src={googleIcon} alt="Google" className="google-icon" />
                <span>{isSubmitting ? "Loading..." : "Google"}</span>
              </button>
              <button
                type="button"
                className="social-button"
                onClick={handleFacebookLogin}
                disabled={isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.7 : 1,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                <img
                  src={facebookLogo}
                  alt="Facebook"
                  className="facebook-icon"
                />
                <span>{isSubmitting ? "Loading..." : "Facebook"}</span>
              </button>
            </div>
          </form>

          <div className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="right-panel">
          <div className="brand-row">
            <img
              src={certicodeIcon}
              alt="Certicode logo"
              className="brand-logo"
            />
          </div>
          <h2 className="marketing-title">
            Supercharge Your Business
            <span>with Our Digital Systems</span>
          </h2>
          <p className="marketing-text">
            Get access to premium templates and applications designed to power
            up your online business.
          </p>
          <img
            src={registerIllustration}
            alt="E-commerce dashboard illustration"
            className="marketing-illustration"
          />
        </div>
      </div>
      <Link to="/" className="back-home">
        <img src={arrowLeft} alt="" className="back-home-icon" />
        Back to Home
      </Link>

      <OtpVerificationModal
        isOpen={isOtpModalOpen}
        email={pendingUserData?.email || email}
        loading={isSubmitting}
        onClose={handleOtpClose}
        onVerify={handleOtpVerify}
        onResend={handleResendOtp}
      />
    </div>
  );
};

export default Register;
