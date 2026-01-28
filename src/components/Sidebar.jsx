import { useState } from "react";
import { Link } from "react-router-dom"; 
import logo from "../assets/certicodeicon.png";
import "../styles/sidebar.css";
import logout from "../assets/logout.webp";
import LogoutModal from "./LogoutModal";

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
          <ul className="menu-top">
            <li className={activePage === "dashboard" ? "active" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li className={activePage === "inventory" ? "active" : ""}>
              <Link to="/inventory">Inventory</Link>
            </li>
            <li className={activePage === "sales" ? "active" : ""}>
              <Link to="/sales">Sales</Link>
            </li>
            <li className={activePage === "customers" ? "active" : ""}>
              <Link to="/customers">Customers</Link>
            </li>
          </ul>

          <div className="menu-section-label">SYSTEM</div>

          <ul className="menu-bottom">
            <li className={activePage === "settings" ? "active" : ""}>
              <Link to="/settings">Settings</Link>
            </li>
            <li className={activePage === "support" ? "active" : ""}>
              <Link to="/support">Support</Link>
            </li>
          </ul>

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