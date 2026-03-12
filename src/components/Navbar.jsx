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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440,
  );
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const normalizedUserRole = String(user?.role || "").trim().toLowerCase();
  const isAdminSession = normalizedUserRole === "admin";
  const isCustomerSession = !!user && normalizedUserRole === "customer";
  const profileDestination = isAdminSession ? "/dashboard" : "/buyer-dashboard";

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
  }, [location.pathname]);

  useEffect(() => {
    const syncNavbarSession = () => {
      fetchUserData();
    };

    window.addEventListener("focus", syncNavbarSession);
    window.addEventListener("storage", syncNavbarSession);

    return () => {
      window.removeEventListener("focus", syncNavbarSession);
      window.removeEventListener("storage", syncNavbarSession);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      const nextWidth = window.innerWidth;
      setViewportWidth(nextWidth);
      if (nextWidth > 1100) {
        setIsMobileMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobileMenuOpen]);

  const fetchUserData = async () => {
    try {
      // Check if user is logged in (check for auth token)
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const userData = await ProfileAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data for navbar:", error);
      setUser(null);
      // User might not be logged in or token expired
    } finally {
      setLoading(false);
    }
  };

  // Check if user is logged in
  const isLoggedIn = !!user;
  const isCompactNav = viewportWidth <= 1100;

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`nav${isCompactNav ? " nav--compact" : ""}`}>
      <div className="nav__inner">
        <div className="nav__brand">
          <img src={CerticodeLogo} alt="certicode" className="certicode-logo" />
        </div>

        {!isCompactNav ? (
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
        ) : null}

        {!isCompactNav ? (
          <div className="nav__actions nav__actions--desktop">
            {isCustomerSession && (
              <Link className="iconBtn nav__actionLink" aria-label="Cart" to="/cart">
                <img className="iconImg" src={CartIcon} alt="" />
              </Link>
            )}

            {isAdminSession && !loading && (
              <Link className="btn btn--light" to="/dashboard">
                Admin Panel
              </Link>
            )}

            {isLoggedIn && !loading && (
              <Link
                className="iconBtn nav__actionLink"
                aria-label="Profile"
                to={profileDestination}
              >
                <img
                  className="iconImg nav__avatar"
                  src={resolveAvatarUrl(user?.avatar_url) || AvatarImg}
                  alt={user?.name || "User"}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #e8e8e8",
                  }}
                  onError={(e) => {
                    console.error(
                      "Navbar avatar failed to load:",
                      user?.avatar_url,
                    );
                    e.target.src = AvatarImg;
                    e.target.onerror = null;
                  }}
                />
              </Link>
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
        ) : null}

        {isCompactNav ? (
          <button
            className={`nav__menuToggle${isMobileMenuOpen ? " is-open" : ""}`}
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        ) : null}
      </div>

      {isCompactNav && isMobileMenuOpen ? (
        <div className="nav__mobilePanel" id="mobile-navigation">
          <nav className="nav__mobileLinks" aria-label="Mobile navigation">
            <Link
              className={`nav__mobileLink${isActiveHash("#hero") ? " is-active" : ""}`}
              to="/#hero"
              onClick={() => {
                handleSectionClick("hero");
                closeMobileMenu();
              }}
            >
              Home
            </Link>
            <NavLink
              className={({ isActive }) =>
                `nav__mobileLink${isActive ? " is-active" : ""}`
              }
              to="/marketplace"
              onClick={closeMobileMenu}
            >
              Marketplace
            </NavLink>
            <Link
              className={`nav__mobileLink${
                isActiveHash("#categories") ? " is-active" : ""
              }`}
              to="/#categories"
              onClick={() => {
                handleSectionClick("categories");
                closeMobileMenu();
              }}
            >
              Categories
            </Link>
            <Link
              className={`nav__mobileLink${
                isActiveHash("#process") ? " is-active" : ""
              }`}
              to="/#process"
              onClick={() => {
                handleSectionClick("process");
                closeMobileMenu();
              }}
            >
              How It Works
            </Link>
            <Link
              className={`nav__mobileLink${isActiveHash("#faq") ? " is-active" : ""}`}
              to="/#faq"
              onClick={() => {
                handleSectionClick("faq");
                closeMobileMenu();
              }}
            >
              FAQ
            </Link>
          </nav>

          <div className="nav__mobileActions">
            {isLoggedIn && !loading ? (
              <>
                {isCustomerSession ? (
                  <Link className="nav__mobileAction" to="/cart" onClick={closeMobileMenu}>
                    Cart
                  </Link>
                ) : null}
                <Link
                  className="nav__mobileAction nav__mobileAction--primary"
                  to={profileDestination}
                  onClick={closeMobileMenu}
                >
                  {isAdminSession ? "Admin Panel" : "Dashboard"}
                </Link>
              </>
            ) : null}

            {!isLoggedIn && !loading ? (
              <>
                <Link className="nav__mobileAction" to="/login" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link
                  className="nav__mobileAction nav__mobileAction--primary"
                  to="/register"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
