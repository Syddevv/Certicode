import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminSetting.css";
import notifBell from "../../assets/NotifBell.png";
import { ProfileAPI } from "../../services/ProfileAPI";

const AdminSetting = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await ProfileAPI.getCurrentUser();
      setUser(data);
      setProfileData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || ""
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
    const field = e.target.previousSibling.textContent.toLowerCase().includes("name") 
      ? "name" 
      : "email";
    
    setProfileData(prev => ({
      ...prev,
      [field]: value
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
          type: 'error', 
          text: 'Image dimensions should be less than 1024x1024 pixels' 
        });
        e.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
        e.target.value = '';
        return;
      }

      if (!file.type.match('image.*')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        e.target.value = '';
        return;
      }

      try {
        setSaving(true);
        setMessage({ type: '', text: '' });
        
        const result = await ProfileAPI.uploadAvatar(file);
        
        setMessage({ type: 'success', text: result.message || 'Avatar updated successfully' });
        
        setUser(prev => ({ ...prev, avatar_url: result.avatar_url }));
        
        e.target.value = '';
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
        
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to upload avatar. Please try again.' 
        });
        e.target.value = '';
      } finally {
        setSaving(false);
      }
    };

    img.onerror = () => {
      setMessage({ type: 'error', text: 'Failed to load image. Please select a valid image file.' });
      e.target.value = '';
    };
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setMessage({ type: "", text: "" });
      
      const dataToSend = {
        name: profileData.name,
        email: profileData.email,
        company_name: ""
      };
      
      const result = await ProfileAPI.updateProfile(dataToSend);
      
      setMessage({ type: "success", text: result.message || "Profile updated successfully" });
      
      if (result.user) {
        setUser(prev => ({ ...prev, ...result.user }));
      }
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to update profile. Please try again." 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      setMessage({ type: "", text: "" });
      
      const newPassword = prompt("Enter new password:");
      const confirmPassword = prompt("Confirm new password:");
      
      if (!newPassword || !confirmPassword) {
        setMessage({ type: "error", text: "Please fill in all password fields" });
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setMessage({ type: "error", text: "New passwords do not match" });
        return;
      }
      
      const currentPassword = prompt("Enter your current password:");
      
      if (!currentPassword) {
        setMessage({ type: "error", text: "Please enter your current password" });
        return;
      }
      
      const result = await ProfileAPI.updatePassword({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });
      
      setMessage({ type: "success", text: result.message || "Password updated successfully" });
      
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      
    } catch (error) {
      console.error("Failed to update password:", error);
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to update password. Please try again." 
      });
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
            <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
              <img src={notifBell} alt="Notifications" className="topbar-icon" />
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
        <AdminTopbar searchIcon={<span className="search-icon">🔍</span>}>
          <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
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
          <button className="tab" onClick={() => navigate("/platform-settings")}>
            Platform Settings
          </button>
        </div>

        <div className="settings-grid">
          
          <div className="settings-left">
            
            <div className="settings-card">
              <div className="card-header-left" style={{ justifyContent: 'flex-start' }}>
                <div className="icon-circle orange">👤</div>
                <div className="header-text-group">
                  <h4>Account Information</h4>
                  <p className="card-sub">View and update your personal details and account information.</p>
                </div>
              </div>

              <div className="profile-row">
                <div className="avatar-section">
                  <img 
                    src={user?.avatar_url || "https://i.pravatar.cc/150?u=alex"} 
                    alt="Profile" 
                    className="avatar-large" 
                    onError={(e) => {
                      console.error('Image failed to load:', user?.avatar_url);
                      e.target.src = "https://i.pravatar.cc/150?u=alex";
                      e.target.onerror = null;
                    }}
                  />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAvatarUpload}
                  />
                  <button 
                    className="text-btn orange"
                    onClick={() => document.getElementById('avatar-upload').click()}
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
              <div className="card-header-left" style={{ justifyContent: 'flex-start' }}>
                <div className="icon-circle orange">🛡️</div>
                <div className="header-text-group">
                  <h4>Security Settings</h4>
                  <p className="card-sub">Configure authentication protocols and session policies.</p>
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
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? "Changing..." : "Change Password"}
                </button>
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
              <div className="card-header-left" style={{ justifyContent: 'flex-start' }}>
                <h4>Admin Activity Log</h4>
                <div className="push-right">
                   <span className="icon-grey">🕒</span>
                </div>
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