import React, { useEffect, useState } from "react";
import CartIcon from "../assets/NavCart.png";
import AvatarImg from "../assets/default-profile.png";
import "../styles/nav.css";
import CerticodeLogo from "../assets/certicodeicon.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ProfileAPI } from "../services/ProfileAPI";
import { resolveAvatarUrl } from "../utils/avatar";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  const isActiveHash = (hash) =>
    isLanding &&
    (location.hash === hash || (!location.hash && hash === "#hero"));

  const handleSectionClick = (sectionId) => {
    if (!isLanding) return;
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Check if user is logged in (check for auth token)
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      const userData = await ProfileAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data for navbar:", error);
      // User might not be logged in or token expired
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  const isLoggedIn = !!user;

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__brand">
          <img src={CerticodeLogo} alt="certicode" className="certicode-logo" />
        </div>

        <nav className="nav__links">
          <Link
            className={`nav__link${isActiveHash("#hero") ? " is-active" : ""}`}
            to="/#hero"
            onClick={() => handleSectionClick("hero")}
          >
            Home
          </Link>
          <NavLink
            className={({ isActive }) =>
              `nav__link${isActive ? " is-active" : ""}`
            }
            to="/marketplace"
          >
            Marketplace
          </NavLink>
          <Link
            className={`nav__link${
              isActiveHash("#categories") ? " is-active" : ""
            }`}
            to="/#categories"
            onClick={() => handleSectionClick("categories")}
          >
            Categories
          </Link>
          <Link
            className={`nav__link${
              isActiveHash("#process") ? " is-active" : ""
            }`}
            to="/#process"
            onClick={() => handleSectionClick("process")}
          >
            How It Works
          </Link>
          <Link
            className={`nav__link${isActiveHash("#faq") ? " is-active" : ""}`}
            to="/#faq"
            onClick={() => handleSectionClick("faq")}
          >
            FAQ
          </Link>
        </nav>

        <div className="nav__actions">
          {isLoggedIn && (
            <button className="iconBtn" aria-label="Cart" type="button">
              <Link to="/cart">
                <img className="iconImg" src={CartIcon} alt="" />
              </Link>
            </button>
          )}

          {isLoggedIn && !loading && (
            <button className="iconBtn" aria-label="Profile" type="button">
              <Link to="/buyer-dashboard">
                <img 
                  className="iconImg nav__avatar" 
                  src={resolveAvatarUrl(user?.avatar_url) || AvatarImg} 
                  alt={user?.name || "User"}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #e8e8e8'
                  }}
                  onError={(e) => {
                    console.error('Navbar avatar failed to load:', user?.avatar_url);
                    e.target.src = AvatarImg;
                    e.target.onerror = null;
                  }}
                />
              </Link>
            </button>
          )}

          {!isLoggedIn && !loading && (
            <>
              <Link className="btn btn--ghost" to="/login">
                Login
              </Link>
              <Link className="btn btn--light" to="/register">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
