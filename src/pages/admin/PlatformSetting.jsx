import React from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../../components/Sidebar"; 
import "../../styles/platformSetting.css";

const PlatformSetting = () => {
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
            <button className="notification-btn">
              🔔<span className="dot"></span>
            </button>
            <button className="btn-save">Save Changes</button>
          </div>
        </div>

        <div className="content-wrapper">
          <div className="page-header">
            <h2>Settings</h2>
          </div>
            <p className="subtitle">Manage your platform's public identity and core regional preferences.</p>

          <div className="tabs">
            <button className="tab" onClick={() => navigate("/settings")}>My Account</button>
            <button className="tab active">Platform Settings</button>
          </div>

          <div className="settings-container">
            
            <div className="settings-card">
              <div className="card-header-start">
                <div className="icon-box orange-bg">
                  <span>🖥️</span> 
                </div>
                <div className="header-text">
                  <h4>Platform Identity</h4>
                  <p>Basic identification details for the admin console and user portal.</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label>Platform Name</label>
                  <input type="text" defaultValue="CertiCode" />
                  <p className="helper-text">Appears in email footers and browser tabs.</p>
                </div>
                <div className="input-group">
                  <label>Support Email Address</label>
                  <input type="email" defaultValue="support@certicode.com" />
                  <p className="helper-text">Used for automated system communications.</p>
                </div>
                <div className="input-group">
                  <label>Default Currency</label>
                  <select>
                    <option>USD-US-Dollar</option>
                    <option>EUR-Euro</option>
                  </select>
                  <p className="helper-text">Base currency for all billing calculations.</p>
                </div>
                <div className="input-group">
                  <label>Timezone</label>
                  <select>
                    <option>(UTC-05:00) Eastern Time (US & Canada)</option>
                    <option>(UTC+00:00) London</option>
                  </select>
                  <p className="helper-text">System wide date and time reporting.</p>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="card-header space-between">
                <div className="header-left">
                  <div className="icon-box orange-bg">
                    <span>🛡️</span>
                  </div>
                  <div className="header-text">
                    <h4>Security & Access</h4>
                    <p>Configure authentication protocols and session policies.</p>
                  </div>
                </div>
                <span className="badge-enforced">ENFORCED</span>
              </div>

              <div className="security-list">
                <div className="security-row">
                  <div className="row-info">
                    <strong>Multi-Factor Authentication (MFA)</strong>
                    <p>Require MFA for all administrative accounts</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="security-row">
                  <div className="row-info">
                    <strong>Automatic Session Timeout</strong>
                    <p>Require MFA for all administrative accounts</p>
                  </div>
                  <select className="row-select">
                    <option>30 Minutes</option>
                    <option>1 Hour</option>
                  </select>
                </div>

                <div className="security-row no-border">
                  <div className="row-info">
                    <strong>IP Whitelisting</strong>
                    <p>Limit admin access to specific IP ranges</p>
                  </div>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformSetting;