import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BuyerAccountSettings.css";
import Avatar from "../../assets/default-profile.png";
import OrangeBadge from "../../assets/orangeBadge.png";
import DeleteIcon from "../../assets/Delete.png";
import AlertTriangle from "../../assets/AlertTriangle.png";
import ProfileIcon from "../../assets/orangeprofile.png";
import NotificationIcon from "../../assets/NotifBell.png";
import MoonIcon from "../../assets/OrangeMoon.png";
import WalletIcon from "../../assets/wallet.png";
import { ProfileAPI } from "../../services/ProfileAPI";
import { resolveAvatarUrl } from "../../utils/avatar";
import EditBillingDetailsModal from "../../components/Editbillingdetailsmodal ";

const BuyerAccountSettings = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company_name: "",
    avatar_url: "",
  });
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isUpdateBillingModal, setUpdateBillingModal] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsDeleteOpen(false);
      }
    };

    if (isDeleteOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [isDeleteOpen]);

  useEffect(() => {
    if (isUpdateBillingModal || isDeleteOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isUpdateBillingModal, isDeleteOpen]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create image to check dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(img.src);

      // Check dimensions
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

        console.log("Uploading file:", file.name, file.type, file.size);

        const result = await ProfileAPI.uploadAvatar(file);

        console.log("Upload result:", result);

        setMessage({
          type: "success",
          text: result.message || "Avatar updated successfully",
        });

        const nextAvatarUrl =
          result.avatar_url ||
          result.user?.avatar_url ||
          result.data?.avatar_url ||
          "";

        setUser((prev) => ({ ...prev, avatar_url: nextAvatarUrl }));
        setProfileData((prev) => ({ ...prev, avatar_url: nextAvatarUrl }));

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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await ProfileAPI.getCurrentUser();
      setUser(data);
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        company_name: data.company_name || "",
        avatar_url: data.avatar_url || "",
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setMessage({ type: "error", text: "Failed to load user data" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [id === "full-name" ? "name" : id === "company" ? "company_name" : id]:
        value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { placeholder, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [placeholder === "Old Password"
        ? "current_password"
        : placeholder === "New Password"
          ? "new_password"
          : "new_password_confirmation"]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });

      const dataToSend = {
        name: profileData.name,
        email: profileData.email,
        company_name: profileData.company_name,
        avatar_url: profileData.avatar_url,
      };

      const result = await ProfileAPI.updateProfile(dataToSend);

      setMessage({
        type: "success",
        text: result.message || "Profile updated successfully",
      });

      if (result.user) {
        setUser((prev) => ({ ...prev, ...result.user }));
      }

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

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      setMessage({ type: "", text: "" });

      if (
        !passwordData.current_password ||
        !passwordData.new_password ||
        !passwordData.new_password_confirmation
      ) {
        setMessage({
          type: "error",
          text: "Please fill in all password fields",
        });
        return;
      }

      if (
        passwordData.new_password !== passwordData.new_password_confirmation
      ) {
        setMessage({ type: "error", text: "New passwords do not match" });
        return;
      }

      const result = await ProfileAPI.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      });

      setMessage({
        type: "success",
        text: result.message || "Password updated successfully",
      });

      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update password:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update password. Please try again.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      setMessage({ type: "", text: "" });

      if (!deletePassword) {
        setMessage({
          type: "error",
          text: "Please enter your password to confirm",
        });
        return;
      }

      const result = await ProfileAPI.deleteAccount(deletePassword);

      setMessage({
        type: "success",
        text: result.message || "Account deleted successfully",
      });

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Failed to delete account:", error);
      setMessage({
        type: "error",
        text:
          error.message ||
          "Failed to delete account. Please check your password.",
      });
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleLogout = async () => {
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

  const handleDialogDelete = () => {
    handleDeleteAccount();
    setIsDeleteOpen(false);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="account-settings">
          <div className="account-settings__inner">
            <div className="account-loading">
              <h2>Loading account settings...</h2>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="account-settings">
        <div className="account-settings__inner">
          <div className="account-profile">
            <div className="account-profile__info">
              <div
                className="account-profile__avatarWrap"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #e8e8e8",
                }}
              >
                <img
                  src={resolveAvatarUrl(user?.avatar_url) || Avatar}
                  alt={user?.name || "User"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", user?.avatar_url);
                    e.target.src = Avatar;
                    e.target.onerror = null;
                  }}
                />
                <span className="account-profile__status" aria-hidden="true" />
              </div>
              <div>
                <h2>{user?.name || "User"}</h2>
                <span className="account-profile__badge">
                  <img src={OrangeBadge} alt="" aria-hidden="true" />
                  Verified User
                </span>
              </div>
            </div>
          </div>

          <div className="account-tabs">
            <Link className="account-tab" to="/buyer-dashboard">
              Dashboard
            </Link>
            <Link className="account-tab" to="/my-purchases">
              My Purchases
            </Link>
            <Link className="account-tab" to="/billing-invoices">
              Billing &amp; Invoices
            </Link>
            <button className="account-tab account-tab--active" type="button">
              Account Settings
            </button>
            <Link className="account-tab" to="/customer-support">
              Support
            </Link>
          </div>

          <div className="account-settings__title">
            <h3>Account Settings</h3>
          </div>

          {message.text && (
            <div className={`account-message account-message--${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="account-card">
            <div className="account-card__header">
              <span className="account-card__icon">
                <img src={ProfileIcon} alt="" aria-hidden="true" />
              </span>
              <div>
                <h4>Profile Information</h4>
                <p>
                  Manage your basic account details and contact information.
                </p>
              </div>
            </div>
            <div className="account-card__body account-profile__body">
              <div className="account-profile__photo">
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #e8e8e8",
                  }}
                >
                  <img
                    src={resolveAvatarUrl(user?.avatar_url) || Avatar}
                    alt={user?.name || "User"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      console.error("Image failed to load:", user?.avatar_url);
                      e.target.src = Avatar;
                      e.target.onerror = null;
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarUpload}
                  />
                  <button
                    type="button"
                    className="account-secondary"
                    onClick={() =>
                      document.getElementById("avatar-upload").click()
                    }
                  >
                    Change Picture
                  </button>
                </div>
              </div>
              <div className="account-profile__form">
                <div className="account-field">
                  <label htmlFor="full-name">Full Name</label>
                  <input
                    id="full-name"
                    type="text"
                    placeholder="Jane Doe"
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="account-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane.doe@email.com"
                    value={profileData.email}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="account-field account-field--full">
                  <label htmlFor="company">Company Name</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Sterling Digital Solutions Ltd."
                    value={profileData.company_name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="account-actions">
                  <button
                    className="account-primary"
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="account-card">
            <div className="account-card__header">
              <span className="account-card__icon">
                <img src={OrangeBadge} alt="" aria-hidden="true" />
              </span>
              <div>
                <h4>Security &amp; Authentication</h4>
                <p>
                  Manage account security, passwords, and authentication
                  methods.
                </p>
              </div>
            </div>
            <div className="account-card__body">
              <div className="account-security">
                <div className="account-security__row">
                  <div>
                    <strong>Update Password</strong>
                  </div>
                  <div className="account-security__inputs">
                    <input
                      type="password"
                      placeholder="Old Password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <button
                    className="account-primary"
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </div>
                <div className="account-divider" />
                <div className="account-toggleRow">
                  <div>
                    <strong>Two-Factor Authentication</strong>
                    <span>
                      Secure your account with a secondary verification method.
                    </span>
                  </div>
                  <label className="account-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="account-slider" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="account-grid">
            <div className="account-card">
              <div className="account-card__header">
                <span className="account-card__icon">
                  <img src={NotificationIcon} alt="" aria-hidden="true" />
                </span>
                <div>
                  <h4>Notifications</h4>
                  <p>
                    Manage alerts for system updates, transactions, and support
                    activity.
                  </p>
                </div>
              </div>
              <div className="account-card__body">
                <div className="account-toggleRow">
                  <div>
                    <strong>Asset Updates</strong>
                    <span>When new content is added to your library.</span>
                  </div>
                  <label className="account-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="account-slider" />
                  </label>
                </div>
                <div className="account-divider" />
                <div className="account-toggleRow">
                  <div>
                    <strong>License Reminders</strong>
                    <span>Get alerts 30 days before expiration.</span>
                  </div>
                  <label className="account-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="account-slider" />
                  </label>
                </div>
                <div className="account-divider" />
                <div className="account-toggleRow">
                  <div>
                    <strong>Payment Emails</strong>
                    <span>Invoices and billing confirmations.</span>
                  </div>
                  <label className="account-switch">
                    <input type="checkbox" />
                    <span className="account-slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="account-card">
              <div className="account-card__header">
                <span className="account-card__icon">
                  <img src={MoonIcon} alt="" aria-hidden="true" />
                </span>
                <div>
                  <h4>Preferences</h4>
                  <p>
                    Customize your account experience and interface settings.
                  </p>
                </div>
              </div>
              <div className="account-card__body">
                {/* <div className="account-preference">
                  <strong>Display Theme</strong>
                  <div className="account-choice">
                    <button
                      className="account-choice__btn is-active"
                      type="button"
                    >
                      Light
                    </button>
                    <button className="account-choice__btn" type="button">
                      Dark
                    </button>
                  </div>
                </div> */}
                <div className="account-divider" />
                <div className="account-preference">
                  <strong>Timezone</strong>
                  <select>
                    <option>(UTC-05:00) Eastern Time (US &amp; Canada)</option>
                    <option>(UTC+00:00) London</option>
                    <option>(UTC+08:00) Singapore</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="account-card account-card--inline">
            <div className="account-card__header">
              <span className="account-card__icon">
                <img src={WalletIcon} alt="" aria-hidden="true" />
              </span>
              <div>
                <h4>Billing Summary</h4>
                <p>
                  {user?.company_name || "No company name set"} •
                  <span>Update your billing details in settings</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setUpdateBillingModal(true)}
              className="account-primary"
              type="button"
            >
              Update Billing Details
            </button>
          </div>

          <div className="account-card account-card--danger">
            <div className="account-card__header">
              <span className="account-card__icon account-card__icon--danger">
                <img src={DeleteIcon} alt="" aria-hidden="true" />
              </span>
              <div>
                <h4>Delete your account</h4>
                <p>
                  Deleting your account will permanently remove all of your
                  purchased licenses, invoices, and saved assets. This action is
                  irreversible.
                </p>
              </div>
            </div>
            <div className="account-danger__actions">
              <button
                className="account-secondary"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button
                className="account-danger"
                type="button"
                onClick={() => setIsDeleteOpen(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </section>
      {isDeleteOpen && (
        <div
          className="account-dialog__backdrop"
          role="presentation"
          onClick={() => setIsDeleteOpen(false)}
        >
          <div
            className="account-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="account-dialog__header">
              <h3 id="delete-account-title">Delete your account</h3>
            </div>
            <p className="account-dialog__intro">
              Are you sure you want to permanently delete your CertiCode
              account? This action will:
            </p>
            <ul className="account-dialog__list">
              <li>Permanently remove your account and profile information</li>
              <li>Revoke access to all purchased software and services</li>
              <li>Delete associated certificates and verification history</li>
            </ul>
            <div className="account-dialog__alert">
              <img src={AlertTriangle} alt="" aria-hidden="true" />
              <span>This action cannot be undone</span>
            </div>
            <label className="account-dialog__label" htmlFor="delete-password">
              Please enter your password to confirm.
            </label>
            <input
              id="delete-password"
              type="password"
              placeholder="Enter your password"
              className="account-dialog__input"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
            />
            {message.text && message.type === "error" && (
              <div className="account-dialog__error">{message.text}</div>
            )}
            <div className="account-dialog__actions">
              <button
                className="account-dialog__btn account-dialog__btn--ghost"
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deletingAccount}
              >
                Cancel
              </button>
              <button
                className="account-dialog__btn account-dialog__btn--danger"
                type="button"
                onClick={handleDialogDelete}
                disabled={deletingAccount}
              >
                {deletingAccount ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditBillingDetailsModal
        isOpen={isUpdateBillingModal}
        onClose={() => setUpdateBillingModal(false)}
      />
      <Footer />
    </div>
  );
};

export default BuyerAccountSettings;
