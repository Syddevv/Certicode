import React from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../../components/Sidebar";
import "../../styles/adminSetting.css";

const AdminSetting = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar activePage="settings" />
      <main className="main-content">
        <div className="topbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search anything..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn">🔔</button>
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
                <div className="icon-circle orange">👤</div>
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
                  <div className="icon-circle orange">🛡️</div>
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
                <span className="icon-grey">🕒</span>
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
                    <p>Updated global notification and preferences for the platform</p>
                    <small>YESTERDAY, 4:20 PM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon green">✅</div>
                  <div className="act-content">
                    <strong>Authorized Payout</strong>
                    <p>Approved monthly revenue distribution to dev partners.</p>
                    <small>DEC 31, 2025, 9:00 AM</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="act-icon blue">✏️</div>
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