import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/certicodeadminpanel.png";
import "../styles/sidebar.css";
import logout from "../assets/logout.png";
import DashboardAdmin from "../assets/DashboardAdmin.png";
import InventoryAdmin from "../assets/InventoryAdmin.png";
import SalesAdmin from "../assets/SalesAdmin.png";
import CustomersAdmin from "../assets/CustomersAdmin.png";
import AdminVoucher from "../assets/AdminVoucher.png";
import SettingsAdmin from "../assets/SettingsAdmin.png";
import SupportAdmin from "../assets/SupportAdmin.png";
import DefaultProfileImg from "../assets/default-profile.png";
import LogoutModalDialog from "./LogoutModal";
import { resolveAvatarUrl } from "../utils/avatar";
import { PROFILE_UPDATED_EVENT } from "../utils/profileSync";

const Icons = {
  Dashboard: (
    <img src={DashboardAdmin} alt="Dashboard" width={20} height={20} />
  ),
  Inventory: (
    <img src={InventoryAdmin} alt="Inventory" width={20} height={20} />
  ),
  Sales: <img src={SalesAdmin} alt="Sales" width={20} height={20} />,
  Customers: (
    <img src={CustomersAdmin} alt="Customers" width={20} height={20} />
  ),
  Settings: <img src={SettingsAdmin} alt="Settings" width={20} height={20} />,
  Vouchers: <img src={AdminVoucher} alt="Vouchers" width={20} height={20} />,
  Support: <img src={SupportAdmin} alt="Support" width={20} height={20} />,
};

const Sidebar = ({ activePage }) => {
  const [showLogout, setShowLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState(() => ({
    name: localStorage.getItem("user_name") || "",
    role: localStorage.getItem("user_role") || "Admin",
    avatar_url: "",
  }));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (event) => {
      const nextUser = event?.detail || {};
      if (!nextUser || typeof nextUser !== "object") return;

      setUser((prev) => ({
        ...prev,
        ...nextUser,
      }));

      if (nextUser.name) {
        localStorage.setItem("user_name", nextUser.name);
      }
      if (nextUser.role) {
        localStorage.setItem("user_role", nextUser.role);
      }
    };

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");

      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/profile/current-user",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const responseText = await response.text();

      if (
        responseText.includes("<!DOCTYPE") ||
        responseText.includes("<html")
      ) {
        console.error("Server error response");
        return;
      }

      const data = JSON.parse(responseText);

      if (!response.ok) {
        console.error(
          "Failed to fetch user:",
          data.message || `Error ${response.status}`,
        );
        return;
      }

      const nextUser = data.user || data;
      setUser((prev) => ({ ...prev, ...nextUser }));
      if (nextUser?.name) {
        localStorage.setItem("user_name", nextUser.name);
      }
      if (nextUser?.role) {
        localStorage.setItem("user_role", nextUser.role);
      }
    } catch (error) {
      console.error("Failed to fetch user data in sidebar:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    const token = localStorage.getItem("auth_token");

    if (token) {
      try {
        await fetch("http://127.0.0.1:8000/api/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_name");
    window.location.href = "/login";
  };

  const LogoutModal = ({ onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Logout</h3>
        <p>Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );

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
            <li className={activePage === "vouchers" ? "active" : ""}>
              <Link to="/vouchers">
                <span className="icon">{Icons.Vouchers}</span>
                <span>Vouchers</span>
              </Link>
            </li>
          </ul>

          <div className="menu-section-label">SYSTEM</div>

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

          <div className="profile-item">
            <div className="profile">
              {loading ? (
                <div className="profile-loading">...</div>
              ) : (
                <>
                  <img
                    src={
                      resolveAvatarUrl(user?.avatar_url) || DefaultProfileImg
                    }
                    alt="Admin"
                    onError={(e) => {
                      e.target.src = DefaultProfileImg;
                      e.target.onerror = null;
                    }}
                  />
                  <div>
                    <strong>{user?.name || "Admin User"}</strong>
                    <small> {user?.role || "Admin"}</small>
                  </div>
                </>
              )}
            </div>

            <button className="logout" onClick={() => setShowLogout(true)}>
              <img src={logout} alt="Logout" />
            </button>
          </div>
        </div>
      </aside>

      {/* {showLogout && (
        <LogoutModal
          onClose={() => setShowLogout(false)}
        />
      )} */}

      {showLogout && (
        <LogoutModalDialog
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogout}
          isLoading={loggingOut}
        />
      )}
    </>
  );
};

export default Sidebar;
