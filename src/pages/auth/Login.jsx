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

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePassword = () => setPasswordVisible(!passwordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const credentials = {
        email: email,
        password: password
      };

      const data = await api.login(credentials);
      
      if (data.token && data.user) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_id', data.user.id);
        localStorage.setItem('user_role', data.user.role);
        localStorage.setItem('user_name', data.user.name || '');
        
        if (data.user.role === "Admin") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      }
      
    } catch (error) {
      alert(error.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await api.googleRedirect();
    } catch (error) {
      alert('Google login failed. Please try again.');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await api.facebookRedirect();
    } catch (error) {
      alert('Facebook login failed. Please try again.');
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

            <button type="submit" className="login-button">
              Log in
            </button>

            <div className="divider">
              <span className="divider-text">Or Continue With</span>
            </div>

            <div className="social-buttons">
              <button 
                type="button" 
                className="social-button" 
                onClick={handleGoogleLogin}
              >
                <img src={googleIcon} alt="Google" className="google-icon" />
                <span>Google</span>
              </button>
              <button 
                type="button" 
                className="social-button"
                onClick={handleFacebookLogin}
              >
                <img
                  src={facebookLogo}
                  alt="Facebook"
                  className="facebook-icon"
                />
                <span>Facebook</span>
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
    </div>
  );
};

export default Login;