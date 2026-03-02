import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminSetting.css";
import notifBell from "../../assets/NotifBell.png";
import DefaultProfileImg from "../../assets/default-profile.png";
import { ProfileAPI } from "../../services/ProfileAPI";
import { resolveAvatarUrl } from "../../utils/avatar";
import { emitProfileUpdated } from "../../utils/profileSync";
import {
  IconClock,
  IconPencil,
  IconSettings,
  IconCircleCheck,
  IconSettingsFilled,
  IconShieldCheckFilled,
  IconPencilMinus,
  IconUserCircle,
  IconUserFilled,
  IconShieldLockFilled,
  IconSearch,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

const PasswordInputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoFocus = false,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group">
      <label>{label}</label>
      <div className="password-input-wrap">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
        />
        <button
          type="button"
          className="password-visibility-btn"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          aria-pressed={visible}
        >
          {visible ? <IconEyeOff size={18} /> : <IconEye size={18} />}
        </button>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({
  onClose,
  onSubmit,
  onFieldChange,
  form,
  error,
  loading,
  showCurrentPasswordField,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Change Password</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close change password modal"
          >
            ✕
          </button>
        </div>
        <form onSubmit={onSubmit} className="modal-form">
          {showCurrentPasswordField && (
            <PasswordInputField
              label="Current Password"
              name="currentPassword"
              value={form.currentPassword}
              onChange={onFieldChange}
              placeholder="Enter current password"
              autoFocus
            />
          )}

          <PasswordInputField
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={onFieldChange}
            placeholder="Enter new password"
            autoFocus={!showCurrentPasswordField}
          />

          <PasswordInputField
            label="Confirm New Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={onFieldChange}
            placeholder="Confirm new password"
          />

          {error && <p className="modal-error">{error}</p>}
          <div className="modal-actions">
            <button
              type="button"
              className="btn outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={loading}>
              {loading ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>

      <style>{`
      .modal-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal-box {
        background: #fff;
        border-radius: 12px;
        padding: 28px;
        width: 100%;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      }
      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
      }
      .modal-header h3 { margin: 0; font-size: 1.1rem; font-weight: 600; }
      .modal-close {
        background: none;
        border: none;
        font-size: 1rem;
        cursor: pointer;
        color: #888;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .modal-close:hover { background: #f0f0f0; color: #333; }
      .modal-form { display: flex; flex-direction: column; gap: 16px; }
      .password-input-wrap {
        position: relative;
      }
      .password-input-wrap input {
        width: 100%;
        padding-right: 40px;
      }
      .password-input-wrap input::-ms-reveal,
      .password-input-wrap input::-ms-clear {
        display: none;
      }
      .password-input-wrap input::-webkit-credentials-auto-fill-button,
      .password-input-wrap input::-webkit-contacts-auto-fill-button {
        visibility: hidden;
        display: none !important;
        pointer-events: none;
      }
      .password-visibility-btn {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        border: none;
        background: transparent;
        color: #6b7280;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 2px;
        cursor: pointer;
      }
      .password-visibility-btn:hover {
        color: #374151;
      }
      .modal-error {
        margin: 0;
        font-size: 0.82rem;
        color: #e03e3e;
        background: #fff0f0;
        border: 1px solid #fbc5c5;
        border-radius: 6px;
        padding: 8px 12px;
      }
      .modal-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 4px;
      }
    `}</style>
    </div>
  );
};

const AdminSetting = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordModalError, setPasswordModalError] = useState("");
  const [requireCurrentPassword, setRequireCurrentPassword] = useState(true);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!showPasswordModal) return;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !changingPassword) {
        closePasswordModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showPasswordModal, changingPassword]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await ProfileAPI.getCurrentUser();
      setUser(data);
      if (data?.name) {
        localStorage.setItem("user_name", data.name);
      }
      if (data?.role) {
        localStorage.setItem("user_role", data.role);
      }
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setMessage({ type: "error", text: "Failed to load user data" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { value } = e.target;
    const field = e.target.previousSibling.textContent
      .toLowerCase()
      .includes("name")
      ? "name"
      : "email";

    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(img.src);

      if (img.width > 1024 || img.height > 1024) {
        setMessage({
          type: "error",
          text: "Image dimensions should be less than 1024x1024 pixels",
        });
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "Image size should be less than 2MB",
        });
        e.target.value = "";
        return;
      }

      if (!file.type.match("image.*")) {
        setMessage({ type: "error", text: "Please select an image file" });
        e.target.value = "";
        return;
      }

      try {
        setSaving(true);
        setMessage({ type: "", text: "" });

        const result = await ProfileAPI.uploadAvatar(file);

        setMessage({
          type: "success",
          text: result.message || "Avatar updated successfully",
        });

        const nextAvatarUrl =
          result?.avatar_url ||
          result?.user?.avatar_url ||
          result?.data?.avatar_url ||
          "";

        const nextUser = {
          ...(user || {}),
          avatar_url: nextAvatarUrl,
          name: profileData.name || user?.name || "",
          role: profileData.role || user?.role || "Admin",
        };

        setUser((prev) => ({ ...prev, avatar_url: nextAvatarUrl }));
        emitProfileUpdated(nextUser);

        e.target.value = "";

        setTimeout(() => {
          setMessage({ type: "", text: "" });
        }, 3000);
      } catch (error) {
        console.error("Failed to upload avatar:", error);
        setMessage({
          type: "error",
          text: error.message || "Failed to upload avatar. Please try again.",
        });
        e.target.value = "";
      } finally {
        setSaving(false);
      }
    };

    img.onerror = () => {
      setMessage({
        type: "error",
        text: "Failed to load image. Please select a valid image file.",
      });
      e.target.value = "";
    };
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const dataToSend = {
        name: profileData.name,
        email: profileData.email,
        company_name: "",
      };

      const result = await ProfileAPI.updateProfile(dataToSend);

      setMessage({
        type: "success",
        text: result.message || "Profile updated successfully",
      });

      const updatedUser = {
        ...(user || {}),
        ...(result?.user || {}),
        name: result?.user?.name || profileData.name,
        email: result?.user?.email || profileData.email,
      };

      setUser(updatedUser);
      setProfileData((prev) => ({
        ...prev,
        name: updatedUser.name || prev.name,
        email: updatedUser.email || prev.email,
        role: updatedUser.role || prev.role,
      }));

      if (updatedUser.name) {
        localStorage.setItem("user_name", updatedUser.name);
      }
      if (updatedUser.role) {
        localStorage.setItem("user_role", updatedUser.role);
      }

      emitProfileUpdated(updatedUser);

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const openPasswordModal = () => {
    setPasswordModalError("");
    setRequireCurrentPassword(true);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (changingPassword) return;
    setShowPasswordModal(false);
    setPasswordModalError("");
  };

  const handlePasswordFieldChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordModalError("");
  };

  const getValidationMessage = (error) => {
    const validationErrors = error?.response?.data?.errors;
    if (!validationErrors || typeof validationErrors !== "object") {
      return error?.message || "Failed to update password. Please try again.";
    }

    const firstFieldError = Object.values(validationErrors)?.[0];
    if (Array.isArray(firstFieldError) && firstFieldError[0]) {
      return firstFieldError[0];
    }

    return error?.message || "Failed to update password. Please try again.";
  };

  const handleChangePassword = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordModalError("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordModalError("New passwords do not match");
      return;
    }

    try {
      setChangingPassword(true);
      setMessage({ type: "", text: "" });
      setPasswordModalError("");

      const payload = {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      };

      const result = await ProfileAPI.updatePassword(payload);

      setMessage({
        type: "success",
        text: result.message || "Password updated successfully",
      });

      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update password:", error);
      const errorText = getValidationMessage(error);
      setPasswordModalError(errorText);
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar activePage="settings" />
        <main className="main-content">
          <AdminTopbar searchIcon={<span className="search-icon">🔍</span>}>
            <Link
              to="/admin-notification"
              className="notification-link"
              aria-label="Notifications"
            >
              <img
                src={notifBell}
                alt="Notifications"
                className="topbar-icon"
              />
              <span className="notification-dot" />
            </Link>
            <button className="btn primary">Save Changes</button>
          </AdminTopbar>
          <div className="page-header">
            <h2>Settings</h2>
          </div>
          <div className="settings-loading">
            <h2>Loading settings...</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar activePage="settings" />
      <main className="main-content">
        <AdminTopbar
          searchIcon={
            <IconSearch size={18} stroke={1.5} className="search-icon" />
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
            onClick={handleSaveProfile}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </AdminTopbar>

        <div className="page-header">
          <h2>Settings</h2>
        </div>

        {message.text && (
          <div className={`settings-message settings-message--${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="tabs">
          <button className="tab active">My Account</button>
          <button
            className="tab"
            onClick={() => navigate("/platform-settings")}
          >
            Platform Settings
          </button>
        </div>

        <div className="settings-grid">
          <div className="settings-left">
            <div className="settings-card">
              <div
                className="card-header-left"
                style={{ justifyContent: "flex-start" }}
              >
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
                  <IconUserCircle size={25} stroke={1.5} />
                </div>
                <div className="header-text-group">
                  <h4>Account Information</h4>
                  <p className="card-sub">
                    View and update your personal details and account
                    information.
                  </p>
                </div>
              </div>

              <div className="profile-row">
                <div className="avatar-section">
                  <img
                    src={resolveAvatarUrl(user?.avatar_url) || DefaultProfileImg}
                    alt="Profile"
                    className="avatar-large"
                    onError={(e) => {
                      console.error("Image failed to load:", user?.avatar_url);
                      e.target.src = DefaultProfileImg;
                      e.target.onerror = null;
                    }}
                  />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarUpload}
                  />
                  <button
                    className="text-btn orange"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                  >
                    Change Picture
                  </button>
                  <span className="file-info">MAX SIZE 2MB</span>
                </div>

                <div className="form-section">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="input-group full">
                    <label>Role</label>
                    <div className="locked-input">
                      <input type="text" value={profileData.role} readOnly />
                      <span className="lock">🔒</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div
                className="card-header-left"
                style={{ justifyContent: "flex-start" }}
              >
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
                <div className="header-text-group">
                  <h4>Security Settings</h4>
                  <p className="card-sub">
                    Configure authentication protocols and session policies.
                  </p>
                </div>
                <div className="push-right">
                  <span className="badge success">ENFORCED</span>
                </div>
              </div>

              <div className="security-item">
                <div className="sec-info">
                  <strong>Change Password</strong>
                  <p>Last changed 4 months ago</p>
                </div>
                <button
                  className="btn outline"
                  onClick={openPasswordModal}
                  disabled={changingPassword}
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
              </div>

              <div className="security-item no-border">
                <div className="sec-info">
                  <strong>Two-Factor Authentication</strong>
                  <p>
                    Secure your account with an additional layer of security
                  </p>
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
              <div
                className="card-header-left"
                style={{ justifyContent: "flex-start" }}
              >
                <h4>Admin Activity Log</h4>
                <div className="push-right">
                  <span className="icon-grey">
                    <IconClock size={18} />
                  </span>
                </div>
              </div>

              <ul className="activity-list">
                <li className="activity-item">
                  <div
                    className="act-icon"
                    style={{
                      backgroundColor: "#EEF0FF",
                      borderRadius: "10px",
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#6470F3",
                    }}
                  >
                    <IconPencilMinus size={18} stroke={1.5} />
                  </div>
                  <div className="act-content">
                    <strong>Updated E-commerce SaaS Price</strong>
                    <p>
                      Modified subscription tiers for enterprise tier assets.
                    </p>
                    <small>TODAY, 10:45 AM</small>
                  </div>
                </li>

                <li className="activity-item">
                  <div
                    className="act-icon"
                    style={{
                      backgroundColor: "#FFF3E8",
                      borderRadius: "10px",
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#F97316",
                    }}
                  >
                    <IconSettingsFilled size={18} stroke={1.5} />
                  </div>
                  <div className="act-content">
                    <strong>Change System Settings</strong>
                    <p>
                      Updated global notification and preferences for the
                      platform
                    </p>
                    <small>YESTERDAY, 4:20 PM</small>
                  </div>
                </li>

                <li className="activity-item">
                  <div
                    className="act-icon"
                    style={{
                      backgroundColor: "#EDFAF3",
                      borderRadius: "10px",
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#22C55E",
                    }}
                  >
                    <IconShieldCheckFilled size={18} stroke={1.5} />
                  </div>
                  <div className="act-content">
                    <strong>Authorized Payout</strong>
                    <p>
                      Approved monthly revenue distribution to dev partners.
                    </p>
                    <small>DEC 31, 2025, 9:00 AM</small>
                  </div>
                </li>

                <li className="activity-item">
                  <div
                    className="act-icon"
                    style={{
                      backgroundColor: "#EEF0FF",
                      borderRadius: "10px",
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#6470F3",
                    }}
                  >
                    <IconPencilMinus size={18} stroke={1.5} />
                  </div>
                  <div className="act-content">
                    <strong>Updated FitLife Tracker Mobile App Price</strong>
                    <p>
                      Modified subscription tiers for enterprise tier assets.
                    </p>
                    <small>DEC 27, 2025, 5:00 PM</small>
                  </div>
                </li>
              </ul>

              <button className="btn full-outline">
                View Complete Audit Log
              </button>
            </div>
          </div>
        </div>
      </main>
      {showPasswordModal && (
        <ChangePasswordModal
          onClose={closePasswordModal}
          onSubmit={handleChangePassword}
          onFieldChange={handlePasswordFieldChange}
          form={passwordForm}
          error={passwordModalError}
          loading={changingPassword}
          showCurrentPasswordField={requireCurrentPassword}
        />
      )}
    </div>
  );
};

export default AdminSetting;
