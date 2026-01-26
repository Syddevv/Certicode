import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/LoginAndRegister.css";
import eye1 from "../../assets/eye1.png";
import eye2 from "../../assets/eye2.png";
import googleIcon from "../../assets/googleicon.png";
import facebookLogo from "../../assets/facebooklogo.png";
import certicodeIcon from "../../assets/certicodeicon.png";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  return (
    <div className="login-page-center">
      <div className="login-container">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <h1 className="login-title">Log In</h1>
          <p className="login-subtitle">
            Welcome back! please enter your details
          </p>

          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="login-button">
              Login
            </button>

            <div className="forgot-password">
              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>
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
            Don't have account? <Link to="/register">Sign up</Link>
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

export default Login;
