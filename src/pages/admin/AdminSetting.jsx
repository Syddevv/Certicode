import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/adminSetting.css";
import Sidebar from "../../components/Sidebar";
import orangeProfileIcon from "../../assets/orangeprofile.png";
import securityIcon from "../../assets/security-and-access.png";
import activityLogIcon from "../../assets/activity-log.png";
import updatedEcommerceIcon from "../../assets/updated-e-commerce.png";
import orangeSettingsIcon from "../../assets/orangesettings.png";
import authorizedPayoutIcon from "../../assets/authorized-payout.png";
import updatedFitlifeIcon from "../../assets/updated-fitlife.png";
import notifIcon from "../../assets/notif.png";
import searchIcon from "../../assets/Search.png";

const AdminSetting = () => {
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
        </div>
        <p className="subtitle">Manage your platform's public identity and core regional preferences.</p>

        <div className="tabs">
          <button className="tab active">My Account</button>
          <button className="tab" onClick={() => navigate("/platform-settings")}>
            Platform Settings
          </button>
        </div>

        <div className="settings-grid">
          <div className="settings-left">
            <div className="settings-card">
              <div className="card-header">
                <div className="icon-circle orange">
                  <img src={orangeProfileIcon} alt="Account Settings" className="icon-image" />
                </div>
                <div>
                  <h4>Account Information</h4>
                  <p className="card-sub">View and update your personal details and account information.</p>
                </div>
              </div>

              <div className="profile-row">
                <div className="avatar-section">
                  <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" className="avatar-large" />
                  <button className="text-btn orange">Change Picture</button>
                  <span className="file-info">MAX SIZE 2MB</span>
                </div>

                <div className="form-section">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" defaultValue="Alex Rivera" />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input type="email" defaultValue="alex.rivera@certicode.com" />
                  </div>
                  <div className="input-group full">
                    <label>Role</label>
                    <div className="locked-input">
                      <input type="text" value="Super Admin" readOnly />
                      <span className="lock">🔒</span>
                    </div>
                  </div>
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
                    <h4>Security Settings</h4>
                    <p className="card-sub">Configure authentication protocols and session policies.</p>
                  </div>
                </div>
                <span className="badge success">ENFORCED</span>
              </div>

              <div className="security-item">
                <div className="sec-info">
                  <strong>Change Password</strong>
                  <p>Last changed 4 months ago</p>
                </div>
                <button className="btn outline">Change Password</button>
              </div>

              <div className="security-item no-border">
                <div className="sec-info">
                  <strong>Two-Factor Authentication</strong>
                  <p>Secure your account with an additional layer of security</p>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
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
                  <div className="act-icon blue">
                    <img src={updatedEcommerceIcon} alt="Updated E-commerce" className="act-icon-image" />
                  </div>
                  <div className="act-content">
                    <strong>Updated E-commerce SaaS Price</strong>
                    <p>Modified subscription tiers for enterprise tier assets.</p>
                    <small>TODAY, 10:45 AM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon orange">
                    <img src={orangeSettingsIcon} alt="Orange Settings" className="act-icon-image" />
                  </div>
                  <div className="act-content">
                    <strong>Change System Settings</strong>
                    <p>Updated global notification and preferences for the platform</p>
                    <small>YESTERDAY, 4:20 PM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon green">
                    <img src={authorizedPayoutIcon} alt="Authorized Payout" className="act-icon-image" />
                  </div>
                  <div className="act-content">
                    <strong>Authorized Payout</strong>
                    <p>Approved monthly revenue distribution to dev partners.</p>
                    <small>DEC 31, 2025, 9:00 AM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon blue">
                    <img src={updatedFitlifeIcon} alt="Updated FitLife" className="act-icon-image" />
                  </div>
                  <div className="act-content">
                    <strong>Updated FitLife Tracker Mobile App Price</strong>
                    <p>Modified subscription tiers for enterprise tier assets.</p>
                    <small>DEC 27, 2025, 5:00 PM</small>
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

export default AdminSetting;