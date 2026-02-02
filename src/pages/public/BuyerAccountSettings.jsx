import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BuyerAccountSettings.css";
import Avatar from "../../assets/Avatar.png";
import OrangeBadge from "../../assets/orangeBadge.png";
import DeleteIcon from "../../assets/Delete.png";
import ProfileIcon from "../../assets/orangeprofile.png";
import NotificationIcon from "../../assets/NotifBell.png";
import MoonIcon from "../../assets/OrangeMoon.png";
import WalletIcon from "../../assets/wallet.png";

const BuyerAccountSettings = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="account-settings">
        <div className="account-settings__inner">
          <div className="account-profile">
            <div className="account-profile__info">
              <div className="account-profile__avatarWrap">
                <img
                  className="account-profile__avatar"
                  src={Avatar}
                  alt="Jane Doe"
                />
                <span className="account-profile__status" aria-hidden="true" />
              </div>
              <div>
                <h2>Jane Doe</h2>
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
            <button className="account-tab" type="button">
              Support
            </button>
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
                <img
                  src={Avatar}
                  alt="Jane Doe"
                  className="user-profile-photo"
                />
                <button type="button" className="account-secondary">
                  Change Picture
                </button>
              </div>
              <div className="account-profile__form">
                <div className="account-field">
                  <label htmlFor="full-name">Full Name</label>
                  <input id="full-name" type="text" placeholder="Jane Doe" />
                </div>
                <div className="account-field">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane.doe@email.com"
                  />
                </div>
                <div className="account-field account-field--full">
                  <label htmlFor="company">Company Name</label>
                  <input
                    id="company"
                    type="text"
                    placeholder="Sterling Digital Solutions Ltd."
                  />
                </div>
                <div className="account-actions">
                  <button className="account-primary" type="button">
                    Save Changes
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
                    <input type="password" placeholder="Old Password" />
                    <input type="password" placeholder="New Password" />
                  </div>
                  <button className="account-primary" type="button">
                    Change Password
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
                <div className="account-preference">
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
                </div>
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
                  Horizon Tech Solutions LLC • GB123456789
                  <span>
                    452 Market Street, Ste 1200, San Francisco, CA 94104
                  </span>
                </p>
              </div>
            </div>
            <button className="account-primary" type="button">
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
            <button className="account-danger" type="button">
              Delete Account
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default BuyerAccountSettings;
