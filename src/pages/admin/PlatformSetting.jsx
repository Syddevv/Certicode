import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/platformSetting.css";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import { IconAppWindowFilled, IconShieldLockFilled } from "@tabler/icons-react";

const PlatformSetting = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar activePage="settings" />

      <main className="main-content">
        <AdminTopbar
          searchIcon={
            <img src={searchIcon} alt="Search" className="search-icon" />
          }
        >
          <Link
            to="/admin-notification"
            className="notification-link"
            aria-label="Notifications"
          >
            <img src={notifBell} alt="Notifications" className="topbar-icon" />
            <span className="notification-dot" />
          </Link>
          <button className="btn primary">Save Changes</button>
        </AdminTopbar>

        <div className="page-header">
          <h2>Settings</h2>
        </div>
        <p className="subtitle">
          Manage your platform's public identity and core regional preferences.
        </p>

        <div className="tabs">
          <button className="tab" onClick={() => navigate("/settings")}>
            My Account
          </button>
          <button className="tab active">Platform Settings</button>
        </div>

        <div className="settings-grid">
          <div className="settings-left">
            <div className="settings-card">
              <div className="card-header-start">
                <div
                  className="act-icon"
                  style={{
                    backgroundColor: "#FFF3E8",
                    borderRadius: "10px",
                    width: "43px",
                    height: "43px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    color: "#F97316",
                  }}
                >
                  <IconAppWindowFilled size={25} stroke={1.5} />
                </div>
                <div>
                  <h4>Platform Identity</h4>
                  <p className="card-sub">
                    Basic identification details for the admin console and user
                    portal.
                  </p>
                </div>
              </div>

              <div className="platform-form-grid">
                <div className="input-group">
                  <label>Platform Name</label>
                  <input type="text" defaultValue="CertiCode" />
                  <span className="input-hint">
                    Appears in email footers and browser tabs.
                  </span>
                </div>
                <div className="input-group">
                  <label>Support Email Address</label>
                  <input type="email" defaultValue="support@certicode.com" />
                  <span className="input-hint">
                    Used for automated system communications.
                  </span>
                </div>
                <div className="input-group">
                  <label>Default Currency</label>
                  <select className="full-select" defaultValue="USD">
                    <option value="EUR">EUR - Euro</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound Sterling</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="PHP">PHP - Philippine Peso</option>
                    <option value="SGD">SGD - Singapore Dollar</option>
                  </select>
                  <span className="input-hint">
                    Base currency for all billing calculations.
                  </span>
                </div>
                <div className="input-group">
                  <label>Timezone</label>
                  <select className="full-select" defaultValue="EST">
                    <option value="EST">
                      (UTC-05:00) Eastern Time (US & Canada)
                    </option>
                    <option value="PHT">
                      (UTC+08:00) Philippine Time (PHT)
                    </option>
                    <option value="JST">
                      (UTC+09:00) Japan Standard Time (JST)
                    </option>
                    <option value="CET">
                      (UTC+01:00) Central European Time (CET)
                    </option>
                    <option value="SGT">
                      (UTC+08:00) Singapore Time (SGT)
                    </option>
                    <option value="GMT">
                      (UTC+00:00) Greenwich Mean Time (GMT) – United Kingdom
                    </option>
                  </select>
                  <span className="input-hint">
                    System wide date and time reporting.
                  </span>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header-between">
                <div className="header-group">
                  <div
                    className="act-icon"
                    style={{
                      backgroundColor: "#FFF3E8",
                      borderRadius: "10px",
                      width: "43px",
                      height: "43px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#F97316",
                    }}
                  >
                    <IconShieldLockFilled size={25} stroke={1.5} />
                  </div>
                  <div>
                    <h4>Security & Access</h4>
                    <p className="card-sub">
                      Configure authentication protocols and session policies.
                    </p>
                  </div>
                </div>
                <span className="badge success">ENFORCED</span>
              </div>

              <div className="security-item">
                <div className="sec-info">
                  <strong>Multi-Factor Authentication (MFA)</strong>
                  <p>Require MFA for all administrative accounts</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="security-item">
                <div className="sec-info">
                  <strong>Automatic Session Timeout</strong>
                  <p>Require MFA for all administrative accounts</p>
                </div>
                <select
                  className="full-select"
                  style={{ width: "auto", padding: "6px 12px" }}
                >
                  <option value="5minutes">5 Minutes</option>
                  <option value="10minutes">10 Minutes</option>
                  <option value="15minutes">15 Minutes</option>
                  <option value="20minutes">20 Minutes</option>
                  <option value="30minutes">30 Minutes</option>
                  <option value="45minutes">45 Minutes</option>
                  <option value="60minutes">60 Minutes</option>
                  <option value="90minutes">90 Minutes</option>
                  <option value="2hours">2 Hours</option>
                </select>
              </div>

              <div className="security-item no-border">
                <div className="sec-info">
                  <strong>IP Whitelisting</strong>
                  <p>Limit admin access to specific IP ranges</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformSetting;
