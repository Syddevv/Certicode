import React from "react";
import "../styles/adminTopbar.css";
import { Link } from "react-router-dom";

const DefaultSearchIcon = (
  <span className="search-icon">
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  </span>
);

const AdminTopbar = ({
  className = "",
  showHamburger = false,
  hamburgerFor = "sidebar-toggle",
  searchIcon,
  searchPlaceholder = "Search anything...",
  showSearch = true,
  searchInputProps = {},
  children,
}) => {
  const topbarClassName = ["topbar", "admin-topbar", className]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={topbarClassName}>
      {showHamburger && (
        <label
          htmlFor={hamburgerFor}
          className="hamburger"
          aria-label="Open sidebar"
        >
          &#9776;
        </label>
      )}

      {showSearch && (
        <div className="search-wrapper">
          {searchIcon || DefaultSearchIcon}
          <input
            className="search-input"
            placeholder={searchPlaceholder}
            {...searchInputProps}
          />
        </div>
      )}

      <div className="topbar-actions">{children}</div>
    </header>
  );
};

export default AdminTopbar;
