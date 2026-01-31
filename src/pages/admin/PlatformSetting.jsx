import React from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../../components/Sidebar";
import "../../styles/platformSetting.css";
import searchIcon from "../../assets/Search.png";
import notifIcon from "../../assets/notif.png";
import platformIcon from "../../assets/platform-identity.png";
import securityIcon from "../../assets/security-and-access.png";
import activityLogIcon from "../../assets/activity-log.png";

const PlatformSetting = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar activePage="settings" />
      <main className="main-content">
        <div className="topbar">
          <div className="search-wrapper">
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input className="search-input" placeholder="Search anything..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">
              <img src={notifIcon} alt="Notifications" className="topbar-icon" />
            </button>
            <button className="btn primary">Save Changes</button>
          </div>
        </div>

        <div className="page-header">
          <h2>Settings</h2>
          <p className="subtitle">Manage your platform's public identity and core regional preferences.</p>
        </div>

        <div className="tabs">
          <button className="tab" onClick={() => navigate("/settings")}>
            My Account
          </button>
          <button className="tab active">Platform Settings</button>
        </div>

        <div className="settings-grid">
          <div className="settings-left">
            <div className="settings-card">
              <div className="card-header">
                <div className="icon-circle orange">
                  <img src={platformIcon} alt="Platform Settings" className="icon-image" />
                </div>
                <div>
                  <h4>Platform Identity</h4>
                  <p className="card-sub">Basic identification details for the admin console and user portal.</p>
                </div>
              </div>

              <div className="platform-form-grid">
                <div className="input-group">
                  <label>Platform Name</label>
                  <input type="text" defaultValue="CertiCode" />
                  <span className="input-hint">Appears in email footers and browser tabs.</span>
                </div>
                <div className="input-group">
                  <label>Support Email Address</label>
                  <input type="email" defaultValue="support@certicode.com" />
                  <span className="input-hint">Used for automated system communications.</span>
                </div>
                <div className="input-group">
                  <label>Default Currency</label>
                  <select className="full-select">
                    <option>USD-US-Dollar</option>
                  </select>
                  <span className="input-hint">Base currency for all billing calculations.</span>
                </div>
                <div className="input-group">
                  <label>Timezone</label>
                  <select className="full-select">
                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                  </select>
                  <span className="input-hint">System wide date and time reporting.</span>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header-flex">
                <div className="header-left">
                  <div className="icon-circle orange">
                    <img src={securityIcon} alt="Security Settings" className="icon-image" />
                  </div>
                  <div>
                    <h4>Security & Access</h4>
                    <p className="card-sub">Configure authentication protocols and session policies.</p>
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
                <select className="mini-select">
                  <option>30 Minutes</option>
                </select>
              </div>

              <div className="security-item no-border">
                <div className="sec-info">
                  <strong>IP Whitelisting</strong>
                  <p>Limit admin access to specific IP ranges</p>
                </div>
                <label className="switch">
                  <input type="checkbox" disabled />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-right">
            <div className="settings-card h-full">
              <div className="card-header-simple">
                <h4>Admin Activity Log</h4>
                <img src={activityLogIcon} alt="Activity Log" className="icon-grey" />
              </div>
              <ul className="activity-list">
                <li className="activity-item">
                  <div className="act-icon blue">✏️</div>
                  <div className="act-content">
                    <strong>Updated E-commerce SaaS Price</strong>
                    <p>Modified subscription tiers for enterprise tier assets.</p>
                    <small>TODAY, 10:45 AM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon orange">⚙️</div>
                  <div className="act-content">
                    <strong>Change System Settings</strong>
                    <p>Updated global notification and preferences.</p>
                    <small>YESTERDAY, 4:20 PM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon green">✅</div>
                  <div className="act-content">
                    <strong>Authorized Payout</strong>
                    <p>Approved monthly revenue distribution.</p>
                    <small>DEC 31, 2025, 9:00 AM</small>
                  </div>
                </li>
              </ul>
              <button className="btn full-outline">View Complete Audit Log</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformSetting;