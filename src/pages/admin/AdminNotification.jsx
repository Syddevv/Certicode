import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminNotification.css";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import salesIcon from "../../assets/large-transac.png";
import systemIcon from "../../assets/black-settings.png";
import projectIcon from "../../assets/new-custom.png";
import healthtrackIcon from "../../assets/healthtrack.png";
import supportTicketIcon from "../../assets/supptix.png";
import customerIcon from "../../assets/newcustomer.png";

const AdminNotification = () => {
  const navigate = useNavigate();

  const handleOpenDetail = () => {
    // Re-use the existing support ticket detail page for now
    navigate("/ticket");
  };

  return (
    <div className="layout">
      <Sidebar activePage="notifications" />

      <main className="notifications-main">
        {/* Topbar */}
        <AdminTopbar
          className="notif-topbar"
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
          <div className="user-profile">
            <img src="https://i.pravatar.cc/150?u=alex" alt="Admin" />
          </div>
        </AdminTopbar>

        <section className="notifications-header">
          <div>
            <h1>Notifications</h1>
            <p className="subtitle">
              Manage and track all administrative alerts for CertiCode.
            </p>
          </div>

          <div className="notif-tabs">
            <button className="notif-tab active">All</button>
            <button className="notif-tab">Sales</button>
            <button className="notif-tab">Projects</button>
            <button className="notif-tab">System</button>
          </div>
        </section>

        <section className="notifications-list">
          {/* New Custom Project Request */}
          <article className="notif-card clickable" onClick={handleOpenDetail}>
            <div className="notif-icon-pill orange">
              <img src={projectIcon} alt="Project" />
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <h3>New Custom Project Request</h3>
                <span className="notif-time">2 mins ago</span>
              </div>
              <p className="notif-sub">
                Enterprise Solutions Inc. requested a quote for a custom
                React-based CRM System.
              </p>
              <div className="notif-actions-row">
                <button
                  type="button"
                  className="btn-pill primary"
                  onClick={handleOpenDetail}
                >
                  View Details
                </button>
                <button
                  type="button"
                  className="btn-pill ghost"
                  onClick={(e) => e.stopPropagation()}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </article>

          {/* System Security Update */}
          <article className="notif-card clickable" onClick={handleOpenDetail}>
            <div className="notif-icon-pill">
              <img src={systemIcon} alt="System" />
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <h3>System Security Update</h3>
                <span className="notif-time">45 mins ago</span>
              </div>
              <p className="notif-sub">
                Automated security patch V2.4.1 has been successfully deployed
                to the main cluster.
              </p>
            </div>
          </article>

          {/* HealthTrack Pro Milestone */}
          <article className="notif-card clickable" onClick={handleOpenDetail}>
            <div className="notif-icon-pill soft-blue">
              <img src={healthtrackIcon} alt="HealthTrack Pro" />
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <h3>HealthTrack Pro Milestone</h3>
                <span className="notif-time">3 hours ago</span>
              </div>
              <p className="notif-sub">
                Project &quot;HealthTrack Pro&quot; has reached the development
                phase completion. Beta testing starts tomorrow.
              </p>
            </div>
          </article>

          {/* Large Transaction Alert */}
          <article className="notif-card clickable" onClick={handleOpenDetail}>
            <div className="notif-icon-pill green">
              <img src={salesIcon} alt="Sales" />
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <h3>Large Transaction Alert</h3>
                <span className="notif-time">5 hours ago</span>
              </div>
              <p className="notif-sub">
                A payment of $12,500.00 was received from Wellness Group Inc.
                for purchasing a project.
              </p>
            </div>
          </article>

          {/* Support Ticket Resolved */}
          <article className="notif-card clickable" onClick={handleOpenDetail}>
            <div className="notif-icon-pill gray">
              <img src={supportTicketIcon} alt="Support" />
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <h3>Support Ticket #4521 Resolved</h3>
                <span className="notif-time">Yesterday, 4:30 PM</span>
              </div>
              <p className="notif-sub">
                Issue regarding PayGate API credentials has been marked as
                resolved by support staff.
              </p>
            </div>
          </article>

          {/* New Customer Registered */}
          <article className="notif-card clickable" onClick={handleOpenDetail}>
            <div className="notif-icon-pill purple">
              <img src={customerIcon} alt="Customer" />
            </div>
            <div className="notif-body">
              <div className="notif-title-row">
                <h3>New Customer Registered</h3>
                <span className="notif-time">January 3, 2026</span>
              </div>
              <p className="notif-sub">
                A new client account has been registered and added to the
                CertiCode customer directory.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
};

export default AdminNotification;

