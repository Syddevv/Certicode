import React from "react";
import { useNavigate } from "react-router-dom"; 
import Sidebar from "../../components/Sidebar";
import "../../styles/supportDesk.css";
import urgentIcon from "../../assets/urgent.png";
import volumeIcon from "../../assets/volume.png";
import searchIcon from "../../assets/Search.png";
import notifIcon from "../../assets/notif.png";

const SupportDesk = () => {
  const navigate = useNavigate(); 

  return (
    <div className="layout">
      <Sidebar activePage="support" />
      <main className="main-content">
        <div className="topbar">
          <div className="search-wrapper">
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input className="search-input" placeholder="Search anything..." />
          </div>
          <div className="topbar-actions">
            <button className="btn primary">Assign</button>
            <button className="btn outline">Bulk Close</button>
            <button className="icon-btn">
              <img src={notifIcon} alt="Notifications" className="topbar-icon" />
            </button>
            <img src="https://i.pravatar.cc/150?u=alex" className="user-avatar-small" alt="user" />
          </div>
        </div>

        <div className="page-header-row">
          <div>
            <h2>Support Desk</h2>
            <p className="subtitle">Real-time triage and resolution hub.</p>
          </div>
          <div className="filter-group">
            <button className="filter-pill active">All</button>
            <button className="filter-pill">High Priority</button>
            <button className="filter-pill">Unassigned</button>
            <button className="filter-pill">Overdue</button>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">OPEN TICKETS <span className="badge green">+12%</span></div>
            <div className="stat-value">142</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">AVG. RESPONSE <span className="badge red">+5%</span></div>
            <div className="stat-value">14m</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">RESOLVED TODAY <span className="badge red">-2%</span></div>
            <div className="stat-value">28</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">SLA BREACHES <span className="badge green">+1%</span></div>
            <div className="stat-value">3</div>
          </div>
        </div>

        <div className="support-content-grid">
          <div className="table-wrapper">
            <table className="ticket-table">
              <thead>
                <tr>
                  <th>TICKET ID</th>
                  <th>SUBJECT</th>
                  <th>CATEGORY</th>
                  <th>PRIORITY</th>
                  <th>STATUS</th>
                  <th>SLA TIMER</th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => navigate("/ticket")} style={{ cursor: "pointer" }}>
                  <td className="t-id">#CRT-1024</td>
                  <td>
                    <div className="t-subject">API Key Rotation Issue</div>
                    <div className="t-sub">Stripe Integration Services</div>
                  </td>
                  <td><span className="tag gray">API</span></td>
                  <td><span className="tag red">URGENT</span></td>
                  <td><span className="tag green">OPEN</span></td>
                  <td className="t-timer">00:15:00</td>
                </tr>
                <tr onClick={() => navigate("/ticket")} style={{ cursor: "pointer" }}>
                  <td className="t-id">#CRT-1026</td>
                  <td>
                    <div className="t-subject">WebHook Not Firing</div>
                    <div className="t-sub">CloudSync</div>
                  </td>
                  <td><span className="tag gray">BILLING</span></td>
                  <td><span className="tag orange">MEDIUM</span></td>
                  <td><span className="tag orange">IN-PROGRESS</span></td>
                  <td className="t-timer">00:15:00</td>
                </tr>
                <tr onClick={() => navigate("/ticket")} style={{ cursor: "pointer" }}>
                  <td className="t-id">#CRT-1031</td>
                  <td>
                    <div className="t-subject">Password Reset Loop</div>
                    <div className="t-sub">StartUp.io</div>
                  </td>
                  <td><span className="tag gray">BILLING</span></td>
                  <td><span className="tag red">URGENT</span></td>
                  <td><span className="tag green">OPEN</span></td>
                  <td className="t-timer">00:22:00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="support-sidebar">
            <div className="sidebar-box">
              <h5 className="side-title">
                <img src={volumeIcon} alt="Volume" className="side-icon" />
                VOLUME BY CATEGORY
              </h5>
              <div className="progress-list">
                <div className="prog-item">
                  <div className="prog-info"><span>API</span> <span>42%</span></div>
                  <div className="prog-track"><div className="prog-fill" style={{ width: '42%' }}></div></div>
                </div>
                <div className="prog-item">
                  <div className="prog-info"><span>Auth</span> <span>28%</span></div>
                  <div className="prog-track"><div className="prog-fill" style={{ width: '28%' }}></div></div>
                </div>
              </div>
            </div>

            <div className="sidebar-box transparent">
              <div className="side-header">
                <h5 className="side-title">
                  <img src={urgentIcon} alt="Urgent" className="side-icon" />
                  URGENT ITEMS
                </h5>
                <span className="badge live">3 LIVE</span>
              </div>

              <div className="urgent-card" onClick={() => navigate("/ticket")} style={{ cursor: "pointer" }}>
                <div className="u-top">
                  <span className="u-id">#CRT-1024</span>
                  <span className="u-badge">15M LEFT</span>
                </div>
                <div className="u-title">API Key Rotation Issue</div>
                <div className="u-sub">Stripe Integration Services</div>
              </div>

              <div className="urgent-card" onClick={() => navigate("/ticket")} style={{ cursor: "pointer" }}>
                <div className="u-top">
                  <span className="u-id">#CRT-1026</span>
                  <span className="u-badge">15M LEFT</span>
                </div>
                <div className="u-title">WebHook Not Firing</div>
                <div className="u-sub">CloudSync</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportDesk;