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
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import LogoutModal from "../../components/LogoutModal";

const MfaSetupModal = ({
  onClose,
  onConfirm,
  onCodeChange,
  onCopyUrl,
  code,
  error,
  loading,
  otpauthUrl,
  copied,
  isPreparing,
}) => {
  const qrUrl = otpauthUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauthUrl)}`
    : "";

  return (
    <div
      className="account-mfa-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="account-mfa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-mfa-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="account-mfa-header">
          <h3 id="account-mfa-title">Set Up Two-Factor Authentication</h3>
          <button
            type="button"
            className="account-mfa-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close 2FA setup modal"
          >
            ×
          </button>
        </div>

        <p className="account-mfa-subtitle">
          {isPreparing
            ? "Preparing your authenticator enrollment..."
            : "Scan this QR using Google or Microsoft Authenticator, then enter the 6-digit code."}
        </p>

        {qrUrl ? (
          <div className="account-mfa-qr-wrap">
            <img src={qrUrl} alt="2FA QR code" className="account-mfa-qr" />
          </div>
        ) : null}

        <div className="account-mfa-url">
          <input
            type="text"
            value={otpauthUrl || "Waiting for enrollment URL..."}
            readOnly
          />
          <button
            type="button"
            className="account-secondary"
            onClick={onCopyUrl}
            disabled={!otpauthUrl || isPreparing}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <form onSubmit={onConfirm} className="account-mfa-form">
          <label htmlFor="account-mfa-code">Authentication Code</label>
          <input
            id="account-mfa-code"
            type="text"
            value={code}
            onChange={onCodeChange}
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            autoFocus
          />

          {error ? <p className="account-mfa-error">{error}</p> : null}

          <div className="account-mfa-actions">
            <button
              type="button"
              className="account-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="account-primary"
              disabled={loading || isPreparing || !otpauthUrl}
            >
              {isPreparing ? "Loading..." : loading ? "Verifying..." : "Enable 2FA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MfaDisableModal = ({
  onClose,
  onSubmit,
  onCodeChange,
  onPasswordChange,
  code,
  currentPassword,
  requireCurrentPassword,
  error,
  loading,
}) => {
  return (
    <div
      className="account-mfa-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="account-mfa-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-mfa-disable-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="account-mfa-header">
          <h3 id="account-mfa-disable-title">Disable Two-Factor Authentication</h3>
          <button
            type="button"
            className="account-mfa-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close 2FA disable modal"
          >
            ×
          </button>
        </div>

        <p className="account-mfa-subtitle">
          Enter your authenticator code to confirm disabling 2FA.
        </p>

        <form onSubmit={onSubmit} className="account-mfa-form">
          {requireCurrentPassword ? (
            <>
              <label htmlFor="account-mfa-disable-password">Current Password</label>
              <input
                id="account-mfa-disable-password"
                type="password"
                value={currentPassword}
                onChange={onPasswordChange}
                placeholder="Enter current password"
                autoComplete="current-password"
              />
            </>
          ) : null}

          <label htmlFor="account-mfa-disable-code">Authentication Code</label>
          <input
            id="account-mfa-disable-code"
            type="text"
            value={code}
            onChange={onCodeChange}
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            autoFocus
          />

          {error ? <p className="account-mfa-error">{error}</p> : null}

          <div className="account-mfa-actions">
            <button
              type="button"
              className="account-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="account-primary"
              disabled={loading}
            >
              {loading ? "Disabling..." : "Disable 2FA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [requiresCurrentPassword, setRequiresCurrentPassword] = useState(true);
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [isLogoutModal, setLogoutModal] = useState(false);
  const [isUpdateBillingModal, setUpdateBillingModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaBusy, setMfaBusy] = useState(false);
  const [showMfaSetupModal, setShowMfaSetupModal] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaSetupError, setMfaSetupError] = useState("");
  const [mfaOtpAuthUrl, setMfaOtpAuthUrl] = useState("");
  const [mfaUrlCopied, setMfaUrlCopied] = useState(false);
  const [mfaPreparing, setMfaPreparing] = useState(false);
  const [showMfaDisableModal, setShowMfaDisableModal] = useState(false);
  const [mfaDisableCode, setMfaDisableCode] = useState("");
  const [mfaDisablePassword, setMfaDisablePassword] = useState("");
  const [mfaDisableError, setMfaDisableError] = useState("");

  const notifyUser = (type, text) => {
    const normalizedText = text ? text.replace(/\bmfa\b/gi, "2FA") : text;
    setMessage({ type, text: normalizedText });

    if (!normalizedText) return;
    if (type === "success") {
      showSuccessToast(normalizedText);
      return;
    }
    if (type === "error") {
      showErrorToast(normalizedText);
    }
  };

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
    if (isUpdateBillingModal || isDeleteOpen || isLogoutModal || showMfaSetupModal || showMfaDisableModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isUpdateBillingModal, isDeleteOpen, isLogoutModal, showMfaSetupModal, showMfaDisableModal]);

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
        notifyUser(
          "error",
          "Image dimensions should be less than 1024x1024 pixels",
        );
        e.target.value = "";
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        notifyUser("error", "Image size should be less than 2MB");
        e.target.value = "";
        return;
      }

      if (!file.type.match("image.*")) {
        notifyUser("error", "Please select an image file");
        e.target.value = "";
        return;
      }

      try {
        setSaving(true);
        setMessage({ type: "", text: "" });

        console.log("Uploading file:", file.name, file.type, file.size);

        const result = await ProfileAPI.uploadAvatar(file);

        console.log("Upload result:", result);

        notifyUser("success", result.message || "Avatar updated successfully");

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
        notifyUser(
          "error",
          error.message || "Failed to upload avatar. Please try again.",
        );
        e.target.value = "";
      } finally {
        setSaving(false);
      }
    };

    img.onerror = () => {
      notifyUser(
        "error",
        "Failed to load image. Please select a valid image file.",
      );
      e.target.value = "";
    };
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await ProfileAPI.getCurrentUser();
      setUser(data);
      setRequiresCurrentPassword(
        data?.requires_current_password ?? !data?.provider,
      );
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        company_name: data.company_name || "",
        avatar_url: data.avatar_url || "",
      });
      setMfaEnabled(Boolean(data?.mfa_enabled));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      notifyUser("error", "Failed to load user data");
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
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
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

      notifyUser("success", result.message || "Profile updated successfully");

      if (result.user) {
        setUser((prev) => ({ ...prev, ...result.user }));
      }

      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      console.error("Failed to update profile:", error);
      notifyUser(
        "error",
        error.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      setMessage({ type: "", text: "" });

      if (
        !passwordData.new_password ||
        !passwordData.new_password_confirmation
      ) {
        notifyUser("error", "Please fill in all password fields");
        return;
      }

      if (requiresCurrentPassword && !passwordData.current_password) {
        notifyUser("error", "Please enter your current password");
        return;
      }

      if (
        passwordData.new_password !== passwordData.new_password_confirmation
      ) {
        notifyUser("error", "New passwords do not match");
        return;
      }

      const payload = {
        new_password: passwordData.new_password,
        new_password_confirmation: passwordData.new_password_confirmation,
      };

      if (requiresCurrentPassword) {
        payload.current_password = passwordData.current_password;
      }

      const result = await ProfileAPI.updatePassword(payload);

      notifyUser("success", result.message || "Password updated successfully");
      setRequiresCurrentPassword(true);

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
      notifyUser(
        "error",
        error.message || "Failed to update password. Please try again.",
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const closeMfaSetupModal = (force = false) => {
    if (mfaBusy && !force) return;
    setShowMfaSetupModal(false);
    setMfaCode("");
    setMfaSetupError("");
    setMfaOtpAuthUrl("");
    setMfaUrlCopied(false);
    setMfaPreparing(false);
  };

  const closeMfaDisableModal = (force = false) => {
    if (mfaBusy && !force) return;
    setShowMfaDisableModal(false);
    setMfaDisableCode("");
    setMfaDisablePassword("");
    setMfaDisableError("");
  };

  const handleMfaToggle = async (event) => {
    const wantsEnabled = event.target.checked;

    if (!wantsEnabled) {
      if (mfaEnabled) {
        setMfaDisableCode("");
        setMfaDisablePassword("");
        setMfaDisableError("");
        setShowMfaDisableModal(true);
      }
      return;
    }

    if (mfaEnabled) {
      notifyUser("success", "2FA is already enabled for this account.");
      return;
    }

    try {
      setMfaBusy(true);
      setMfaPreparing(true);
      setMfaSetupError("");
      setMfaOtpAuthUrl("");
      setMfaUrlCopied(false);
      setShowMfaSetupModal(true);

      const result = await ProfileAPI.enrollAdminMfa();
      setMfaOtpAuthUrl(result?.otpauth_url || "");
      setMfaPreparing(false);
    } catch (error) {
      console.error("Failed to start 2FA setup:", error);
      setMfaPreparing(false);
      setMfaSetupError(error?.message || "Failed to start 2FA setup.");
      notifyUser("error", error?.message || "Failed to start 2FA setup.");
    } finally {
      setMfaBusy(false);
    }
  };

  const handleMfaCodeChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, 6);
    setMfaCode(nextValue);
    setMfaSetupError("");
  };

  const handleCopyMfaUrl = async () => {
    if (!mfaOtpAuthUrl) return;
    try {
      await navigator.clipboard.writeText(mfaOtpAuthUrl);
      setMfaUrlCopied(true);
    } catch (error) {
      console.error("Failed to copy 2FA URL:", error);
      setMfaSetupError("Unable to copy URL. Please copy it manually.");
    }
  };

  const handleConfirmMfaSetup = async (event) => {
    event.preventDefault();

    if (mfaCode.length !== 6) {
      setMfaSetupError("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    try {
      setMfaBusy(true);
      setMfaSetupError("");

      const result = await ProfileAPI.confirmAdminMfa(mfaCode);
      setMfaEnabled(Boolean(result?.mfa_enabled));
      setUser((prev) => (prev ? { ...prev, mfa_enabled: true } : prev));
      notifyUser("success", result?.message || "Two-factor authentication enabled.");
      closeMfaSetupModal(true);
    } catch (error) {
      console.error("Failed to confirm 2FA setup:", error);
      const text = error?.message || "Invalid 2FA code.";
      setMfaSetupError(text);
      notifyUser("error", text);
    } finally {
      setMfaBusy(false);
    }
  };

  const handleMfaDisableCodeChange = (event) => {
    const nextValue = event.target.value.replace(/\D/g, "").slice(0, 6);
    setMfaDisableCode(nextValue);
    setMfaDisableError("");
  };

  const handleMfaDisablePasswordChange = (event) => {
    setMfaDisablePassword(event.target.value);
    setMfaDisableError("");
  };

  const handleDisableMfa = async (event) => {
    event.preventDefault();

    if (mfaDisableCode.length !== 6) {
      setMfaDisableError("Please enter the 6-digit code from your authenticator app.");
      return;
    }

    if (requiresCurrentPassword && !mfaDisablePassword) {
      setMfaDisableError("Please enter your current password.");
      return;
    }

    try {
      setMfaBusy(true);
      setMfaDisableError("");

      const payload = { code: mfaDisableCode };
      if (requiresCurrentPassword) {
        payload.current_password = mfaDisablePassword;
      }

      const result = await ProfileAPI.disableMfa(payload);
      setMfaEnabled(Boolean(result?.mfa_enabled));
      setUser((prev) => (prev ? { ...prev, mfa_enabled: false } : prev));
      notifyUser("success", result?.message || "Two-factor authentication disabled.");
      closeMfaDisableModal(true);
    } catch (error) {
      const text = error?.message || "Failed to disable 2FA.";
      setMfaDisableError(text);
      notifyUser("error", text);
    } finally {
      setMfaBusy(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      setMessage({ type: "", text: "" });

      if (!deletePassword) {
        notifyUser("error", "Please enter your password to confirm");
        return;
      }

      const result = await ProfileAPI.deleteAccount(deletePassword);

      notifyUser("success", result.message || "Account deleted successfully");

      localStorage.removeItem("auth_token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_role");
      localStorage.removeItem("user_name");

      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      console.error("Failed to delete account:", error);
      notifyUser(
        "error",
        error.message ||
          "Failed to delete account. Please check your password.",
      );
    } finally {
      setDeletingAccount(false);
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
                    <strong>
                      {requiresCurrentPassword
                        ? "Update Password"
                        : "Set Password"}
                    </strong>
                  </div>
                  <div className="account-security__inputs">
                    {requiresCurrentPassword && (
                      <input
                        type="password"
                        name="current_password"
                        placeholder="Current Password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        autoComplete="current-password"
                      />
                    )}
                    <input
                      type="password"
                      name="new_password"
                      placeholder="New Password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                    />
                    <input
                      type="password"
                      name="new_password_confirmation"
                      placeholder="Confirm New Password"
                      value={passwordData.new_password_confirmation}
                      onChange={handlePasswordChange}
                      autoComplete="new-password"
                    />
                  </div>
                  <button
                    className="account-primary"
                    type="button"
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword
                      ? "Changing..."
                      : requiresCurrentPassword
                        ? "Change Password"
                        : "Set Password"}
                  </button>
                </div>
                <div className="account-divider" />
                <div className="account-toggleRow">
                  <div>
                    <strong>Two-Factor Authentication</strong>
                    <span>
                      {mfaEnabled
                        ? "Enabled for this account."
                        : "Secure your account with a secondary verification method."}
                    </span>
                  </div>
                  <label className="account-switch">
                    <input
                      type="checkbox"
                      checked={mfaEnabled}
                      onChange={handleMfaToggle}
                      disabled={mfaBusy}
                    />
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
                onClick={() => setLogoutModal(true)}
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

      {isLogoutModal && (
        <LogoutModal
          onClose={() => setLogoutModal(false)}
          onConfirm={handleLogout}
          isLoading={loggingOut}
        />
      )}
      <EditBillingDetailsModal
        isOpen={isUpdateBillingModal}
        onClose={() => setUpdateBillingModal(false)}
      />
      {showMfaSetupModal && (
        <MfaSetupModal
          onClose={closeMfaSetupModal}
          onConfirm={handleConfirmMfaSetup}
          onCodeChange={handleMfaCodeChange}
          onCopyUrl={handleCopyMfaUrl}
          code={mfaCode}
          error={mfaSetupError}
          loading={mfaBusy}
          otpauthUrl={mfaOtpAuthUrl}
          copied={mfaUrlCopied}
          isPreparing={mfaPreparing}
        />
      )}
      {showMfaDisableModal && (
        <MfaDisableModal
          onClose={closeMfaDisableModal}
          onSubmit={handleDisableMfa}
          onCodeChange={handleMfaDisableCodeChange}
          onPasswordChange={handleMfaDisablePasswordChange}
          code={mfaDisableCode}
          currentPassword={mfaDisablePassword}
          requireCurrentPassword={requiresCurrentPassword}
          error={mfaDisableError}
          loading={mfaBusy}
        />
      )}
      <Footer />
    </div>
  );
};

export default BuyerAccountSettings;
