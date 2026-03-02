import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/LoginAndRegister.css";
import eye1 from "../../assets/eye1.png";
import eye2 from "../../assets/eye2.png";
import googleIcon from "../../assets/googleicon.png";
import facebookLogo from "../../assets/facebooklogo.png";
import certicodeIcon from "../../assets/certicodeicon.png";
import loginIllustration from "../../assets/Login Image.png";
import arrowLeft from "../../assets/arrowleft.png";
import { api } from "../../services/api";
import { showErrorToast } from "../../utils/toast";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaError, setMfaError] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = {
        email: email,
        password: password,
      };

      const data = await api.login(credentials);

      if (data?.mfa_required && data?.mfa_token) {
        setMfaChallenge({
          mfaToken: data.mfa_token,
          userId: data.user_id,
        });
        setMfaCode("");
        setMfaError("");
        setIsLoading(false);
        return;
      }

      if (data.token && data.user) {
        localStorage.setItem("auth_token", data.token);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_role", data.user.role);
        localStorage.setItem("user_name", data.user.name || "");

        if (String(data.user.role).toLowerCase() === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      showErrorToast(error.message || "Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await api.googleRedirect();
    } catch (error) {
      showErrorToast("Google login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      await api.facebookRedirect();
    } catch (error) {
      showErrorToast("Facebook login failed. Please try again.");
      setIsLoading(false);
    }
  };

  const closeMfaModal = () => {
    if (mfaLoading) return;
    setMfaChallenge(null);
    setMfaCode("");
    setMfaError("");
  };

  const handleMfaCodeChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, 6);
    setMfaCode(nextValue);
    setMfaError("");
  };

  const handleVerifyMfa = async (event) => {
    event.preventDefault();

    if (!mfaChallenge?.mfaToken) {
      setMfaError("MFA session has expired. Please log in again.");
      return;
    }

    if (mfaCode.length !== 6) {
      setMfaError("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    try {
      setMfaLoading(true);
      const data = await api.verifyAdminMfaLogin({
        mfa_token: mfaChallenge.mfaToken,
        code: mfaCode,
      });

      setMfaChallenge(null);
      setMfaCode("");
      setMfaError("");

      if (String(data?.user?.role).toLowerCase() === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMfaError(error.message || "MFA verification failed. Please try again.");
    } finally {
      setMfaLoading(false);
    }
  };

  return (
    <div className="auth-page login-page">
      <div className="login-container">
        <div className="left-panel">
          <div className="login-header">
            <h1 className="login-title">Log In</h1>
            <p className="login-subtitle">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePassword}
                >
                  <img
                    src={passwordVisible ? eye2 : eye1}
                    alt="Toggle password visibility"
                    className="eye-icon-img"
                  />
                </button>
              </div>
            </div>

            <div className="forgot-password">
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Logging in...
                </>
              ) : (
                "Log in"
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
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <img src={googleIcon} alt="Google" className="google-icon" />
                <span>{isLoading ? "Loading..." : "Google"}</span>
              </button>
              <button
                type="button"
                className="social-button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                style={{
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
              >
                <img
                  src={facebookLogo}
                  alt="Facebook"
                  className="facebook-icon"
                />
                <span>{isLoading ? "Loading..." : "Facebook"}</span>
              </button>
            </div>
          </form>

          <div className="signup-link">
            Don&apos;t have account? <Link to="/register">Sign up</Link>
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
            src={loginIllustration}
            alt="E-commerce dashboard illustration"
            className="marketing-illustration"
          />
        </div>
      </div>
      <Link to="/" className="back-home">
        <img src={arrowLeft} alt="" className="back-home-icon" />
        Back to Home
      </Link>

      {mfaChallenge && (
        <div className="auth-mfa-overlay" onClick={closeMfaModal}>
          <div className="auth-mfa-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Two-Factor Verification</h3>
            <p>
              Enter the 6-digit code from your authenticator app to complete
              admin sign in.
            </p>

            <form onSubmit={handleVerifyMfa}>
              <input
                type="text"
                className="auth-mfa-input"
                placeholder="123456"
                value={mfaCode}
                onChange={handleMfaCodeChange}
                inputMode="numeric"
                maxLength={6}
                autoFocus
              />

              {mfaError ? <p className="auth-mfa-error">{mfaError}</p> : null}

              <div className="auth-mfa-actions">
                <button
                  type="button"
                  className="auth-mfa-btn auth-mfa-btn--ghost"
                  onClick={closeMfaModal}
                  disabled={mfaLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="auth-mfa-btn auth-mfa-btn--primary"
                  disabled={mfaLoading}
                >
                  {mfaLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
