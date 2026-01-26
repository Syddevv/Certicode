import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginAndRegister.css";
import eye1 from "../../assets/eye1.png";
import eye2 from "../../assets/eye2.png";
import googleIcon from "../../assets/googleicon.png";
import facebookLogo from "../../assets/facebooklogo.png";
import certicodeIcon from "../../assets/certicodeicon.png";

const Register = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }
    console.log("Signup attempt:", { fullname, email, password });
  };

  return (
    <div className="login-page-center">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1 className="login-title">Sign Up</h1>
          <p className="login-subtitle">Create your account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullname">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                className="form-input"
                placeholder="Enter your full name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
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

            <div className="form-group">
              <label className="form-label" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="form-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group terms-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
                <span className="terms-text">
                  By signing the account, you accept our{" "}
                  <a href="#">Terms &amp; Condition</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </span>
              </label>
            </div>

            <button type="submit" className="login-button">
              Sign Up
            </button>
          </form>

          <div className="divider">
            <span className="divider-text">Or Continue With</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-button">
              <img src={googleIcon} alt="Google" className="google-icon" />
              <span>Google</span>
            </button>
            <button type="button" className="social-button">
              <img
                src={facebookLogo}
                alt="Facebook"
                className="facebook-icon"
              />
              <span>Facebook</span>
            </button>
          </div>

          <div className="signup-link">
            Already have an account? <Link to="/">Log in</Link>
          </div>
        </div>

        <div className="right-panel">
          <div className="logo-container">
            <img
              src={certicodeIcon}
              alt="Certicode logo"
              className="logo-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
