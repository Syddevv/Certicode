import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/certicodeadminpanel.png";
import "../styles/sidebar.css";
import logout from "../assets/logout.png";
import DashboardAdmin from "../assets/DashboardAdmin.png";
import InventoryAdmin from "../assets/InventoryAdmin.png";
import SalesAdmin from "../assets/SalesAdmin.png";
import CustomersAdmin from "../assets/CustomersAdmin.png";
import SettingsAdmin from "../assets/SettingsAdmin.png";
import SupportAdmin from "../assets/SupportAdmin.png";

const Icons = {
  Dashboard: <img src={DashboardAdmin} alt="Dashboard" width={20} height={20} />,
  Inventory: <img src={InventoryAdmin} alt="Inventory" width={20} height={20} />,
  Sales: <img src={SalesAdmin} alt="Sales" width={20} height={20} />,
  Customers: <img src={CustomersAdmin} alt="Customers" width={20} height={20} />,
  Settings: <img src={SettingsAdmin} alt="Settings" width={20} height={20} />,
  Support: <img src={SupportAdmin} alt="Support" width={20} height={20} />,
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

            <button className="logout" onClick={() => setShowLogout(true)}>
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
