import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/certicodeadminpanel.png";
import "../styles/sidebar.css";
import logout from "../assets/logout.png";
import Dashboard from "../assets/logout.png";

const Icons = {
  Dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  Inventory: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  ),
  Sales: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  ),
  Customers: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  Settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  Support: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  )
};

const Sidebar = ({ activePage }) => {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <>
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Certicode Logo" />
        </div>

        <label htmlFor="sidebar-toggle" className="close-btn">
          &times;
        </label>

        <div className="menu">
          {/* MAIN MENU */}
          <ul className="menu-top">
            <li className={activePage === "dashboard" ? "active" : ""}>
              <Link to="/dashboard">
                <span className="icon">{Icons.Dashboard}</span>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className={activePage === "inventory" ? "active" : ""}>
              <Link to="/inventory">
                <span className="icon">{Icons.Inventory}</span>
                <span>Inventory</span>
              </Link>
            </li>
            <li className={activePage === "sales" ? "active" : ""}>
              <Link to="/sales">
                <span className="icon">{Icons.Sales}</span>
                <span>Sales</span>
              </Link>
            </li>
            <li className={activePage === "customers" ? "active" : ""}>
              <Link to="/customers">
                <span className="icon">{Icons.Customers}</span>
                <span>Customers</span>
              </Link>
            </li>
          </ul>

          {/* SYSTEM LABEL */}
          <div className="menu-section-label">SYSTEM</div>

          {/* SYSTEM MENU */}
          <ul className="menu-bottom">
            <li className={activePage === "settings" ? "active" : ""}>
              <Link to="/settings">
                <span className="icon">{Icons.Settings}</span>
                <span>Settings</span>
              </Link>
            </li>
            <li className={activePage === "support" ? "active" : ""}>
              <Link to="/support">
                <span className="icon">{Icons.Support}</span>
                <span>Support</span>
              </Link>
            </li>
          </ul>

          {/* PROFILE */}
          <div className="profile-item">
            <div className="profile">
              <img
                src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                alt="Admin"
              />
              <div>
                <strong>Alex Rivera</strong>
                <small> Admin</small>
              </div>
            </div>

            <button
              className="logout"
              onClick={() => setShowLogout(true)}
            >
              <img src={logout} alt="Logout" />
            </button>
          </div>
        </div>
      </aside>

      {/* LOGOUT MODAL */}
      {showLogout && (
        <LogoutModal
          onClose={() => setShowLogout(false)}
          onConfirm={() => {
            setShowLogout(false);
            console.log("User logged out");
          }}
        />
      )}
    </>
  );
};

export default Sidebar;