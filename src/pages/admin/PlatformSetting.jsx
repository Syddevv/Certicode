import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/platformSetting.css";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import { IconAppWindowFilled, IconShieldLockFilled } from "@tabler/icons-react";
import {
  loadAdminPlatformPreferences,
  saveAdminPlatformPreferences,
  SUPPORTED_CURRENCIES,
} from "../../utils/adminPlatformPreferences";
import { showSuccessToast } from "../../utils/toast";

const PlatformSetting = () => {
  const navigate = useNavigate();
  const initialPreferences = useMemo(() => loadAdminPlatformPreferences(), []);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState(() => ({
    platformName: initialPreferences.platformName,
    supportEmail: initialPreferences.supportEmail,
    currency: initialPreferences.currency,
    timezone: initialPreferences.timezone,
    mfaRequired: true,
    sessionTimeout: "30minutes",
    ipWhitelisting: false,
  }));

  // IP Whitelisting state
  const [allowedIPs, setAllowedIPs] = useState(["192.168.1.1"]);
  const [newIP, setNewIP] = useState("");
  const [showEnableModal, setShowEnableModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // When the toggle is clicked:
  // - turning ON → show confirmation modal before enabling
  // - turning OFF → disable immediately
  const handleIPWhitelistToggle = (checked) => {
    if (checked) {
      setShowEnableModal(true);
    } else {
      handleChange("ipWhitelisting", false);
    }
  };

  const confirmEnableWhitelist = () => {
    handleChange("ipWhitelisting", true);
    setShowEnableModal(false);
  };

  const handleAddIP = () => {
    const trimmed = newIP.trim();
    if (trimmed && !allowedIPs.includes(trimmed)) {
      setAllowedIPs((prev) => [...prev, trimmed]);
      setNewIP("");
    }
  };

  const handleRemoveIP = (ip) => {
    setAllowedIPs((prev) => prev.filter((i) => i !== ip));
  };

  const handleSaveIPs = () => {
    setShowSaveModal(true);
  };

  const confirmSaveIPs = () => {
    // Persist IPs here if needed (e.g. API call)
    showSuccessToast("IP Whitelist saved.");
    setShowSaveModal(false);
  };

  const handleSaveChanges = () => {
    setSaving(true);
    try {
      saveAdminPlatformPreferences({
        platformName: form.platformName,
        supportEmail: form.supportEmail,
        currency: form.currency,
        timezone: form.timezone,
      });
      showSuccessToast("Platform settings saved.");
    } finally {
      setSaving(false);
    }
  };

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
          <button
            className="btn primary"
            onClick={handleSaveChanges}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
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
            {/* Platform Identity Card */}
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
                  <input
                    type="text"
                    value={form.platformName}
                    onChange={(e) =>
                      handleChange("platformName", e.target.value)
                    }
                  />
                  <span className="input-hint">
                    Appears in email footers and browser tabs.
                  </span>
                </div>
                <div className="input-group">
                  <label>Support Email Address</label>
                  <input
                    type="email"
                    value={form.supportEmail}
                    onChange={(e) =>
                      handleChange("supportEmail", e.target.value)
                    }
                  />
                  <span className="input-hint">
                    Used for automated system communications.
                  </span>
                </div>
                <div className="input-group">
                  <label>Default Currency</label>
                  <select
                    className="full-select"
                    value={form.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                  <span className="input-hint">
                    Base currency for all billing calculations.
                  </span>
                </div>
                <div className="input-group">
                  <label>Timezone</label>
                  <select
                    className="full-select"
                    value={form.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                  >
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

            {/* Security & Access Card */}
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

              {/* MFA */}
              <div className="security-item">
                <div className="sec-info">
                  <strong>Multi-Factor Authentication (MFA)</strong>
                  <p>Require MFA for all administrative accounts</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.mfaRequired}
                    onChange={(e) =>
                      handleChange("mfaRequired", e.target.checked)
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Session Timeout */}
              <div className="security-item">
                <div className="sec-info">
                  <strong>Automatic Session Timeout</strong>
                  <p>Automatically log out inactive admin sessions</p>
                </div>
                <select
                  className="full-select"
                  style={{ width: "auto", padding: "6px 12px" }}
                  value={form.sessionTimeout}
                  onChange={(e) =>
                    handleChange("sessionTimeout", e.target.value)
                  }
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

              {/* IP Whitelisting */}
              <div
                className={`security-item${form.ipWhitelisting ? "" : " no-border"}`}
              >
                <div className="sec-info">
                  <strong>IP Whitelisting</strong>
                  <p>Limit admin access to specific IP ranges</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={form.ipWhitelisting}
                    onChange={(e) => handleIPWhitelistToggle(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Expanded IP Whitelist Panel */}
              {form.ipWhitelisting && (
                <div className="ip-whitelist-panel no-border">
                  <p className="ip-panel-sub">
                    Secure connections from whitelisted IPs only.
                  </p>

                  <div className="ip-list">
                    {allowedIPs.map((ip) => (
                      <div key={ip} className="ip-entry">
                        <span>{ip}</span>
                        <button
                          className="ip-remove-btn"
                          onClick={() => handleRemoveIP(ip)}
                          aria-label={`Remove ${ip}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    className="ip-add-link"
                    onClick={() => setAllowedIPs((prev) => [...prev, ""])}
                  >
                    + Add Another IP Address
                  </button>

                  {/* Inline input for new IP */}
                  <div className="ip-input-row">
                    <input
                      type="text"
                      className="ip-input"
                      placeholder="e.g. 203.0.113.0"
                      value={newIP}
                      onChange={(e) => setNewIP(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddIP()}
                    />
                    <button className="btn secondary" onClick={handleAddIP}>
                      Add
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "12px",
                    }}
                  >
                    <button className="btn primary" onClick={handleSaveIPs}>
                      Save IP Address
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal: Activate IP Whitelist confirmation */}
      {showEnableModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Activate IP Whitelist?</h3>
            <p>
              Are you sure you want to enable IP Whitelisting? Once enabled,
              only the IPs on the whitelist will have access.
            </p>
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setShowEnableModal(false)}
              >
                Cancel
              </button>
              <button className="btn primary" onClick={confirmEnableWhitelist}>
                Enable
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Save IP Whitelist confirmation */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Save IP Whitelist?</h3>
            <p>
              Are you sure you want to save the IP Whitelist? Only the IPs you
              add will have access.
            </p>
            <div className="modal-actions">
              <button
                className="btn secondary"
                onClick={() => setShowSaveModal(false)}
              >
                Cancel
              </button>
              <button className="btn primary" onClick={confirmSaveIPs}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformSetting;
