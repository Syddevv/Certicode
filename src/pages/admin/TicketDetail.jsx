import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "../../styles/ticketDetail.css";
import searchIcon from "../../assets/Search.png";
import notifIcon from "../../assets/notif.png";
import stripeIcon from "../../assets/stripe.png";
import vectorMailIcon from "../../assets/tabler_mail-filled.png";
import vectorAssetIcon from "../../assets/Vectorasset.png";
import vectorShareIcon from "../../assets/Vectorshare.png";
import tripleDotIcon from "../../assets/tripledot.png";
import galleryIcon from "../../assets/gallery.png";
import vectorDownloadIcon from "../../assets/lucide_download.png";
import lockIcon from "../../assets/lockicon.png";
import groupDueInIcon from "../../assets/Groupduein.png";
import vectorFirstResponseIcon from "../../assets/Vectorfirstresponse.png";
import vectorServiceTierIcon from "../../assets/Vectorservicetier.png";
import archiveIcon from "../../assets/archive.png";
import attachFileIcon from "../../assets/attachfile.png";

const TicketDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar activePage="support" />

      <main className="main-content detail-bg">
        <header className="topbar">
          <div className="search-wrapper">
            <img src={searchIcon} alt="Search" className="search-icon" />
            <input className="search-input" placeholder="Search anything..." />
          </div>
          <div className="topbar-actions">
            <button className="icon-btn-notif">
              <img src={notifIcon} alt="Notifications" className="topbar-icon" />
              <span className="notif-dot"></span>
            </button>
            <div className="user-profile">
              <img src="https://i.pravatar.cc/150?u=alex" alt="User" />
            </div>
          </div>
        </header>

        <div className="detail-container">
          <section className="ticket-main">
            <nav className="breadcrumbs">
              <span onClick={() => navigate("/support")} className="crumb-link">Support Desk Inbox</span>
              <span className="crumb-separator">›</span>
              <span className="crumb-active">API Key Rotation Issue</span>
            </nav>

            <div className="ticket-header">
              <div className="header-content">
                <div className="title-row">
                  <h1>API Key Rotation Issue</h1>
                  <span className="badge-active">Active</span>
                </div>
                <div className="meta-row">
                  <span><img src={stripeIcon} alt="Stripe" className="meta-icon" /> Stripe Integration Services</span>
                  <span><img src={vectorMailIcon} alt="Email" className="meta-icon" /> dev.support@stripe-integration.com</span>
                  <span><img src={vectorAssetIcon} alt="Asset" className="meta-icon" /> Asset: PRO-CERT-2026-X9</span>
                </div>
              </div>
              <div className="header-actions">
                <button className="btn-icon-square">
                  <img src={vectorShareIcon} alt="Share" className="action-icon" />
                </button>
                <button className="btn-icon-square">
                  <img src={tripleDotIcon} alt="More" className="action-icon" />
                </button>
              </div>
            </div>

            <div className="conversation-thread">

              <div className="message-row client">
                <div className="avatar-box">MC</div>
                <div className="message-body">
                  <div className="message-meta">
                    <strong>Marcus Chen</strong> <span className="time">10:42 AM</span>
                  </div>
                  <div className="message-bubble white-bubble">
                    <p>Hi Support Team, we are attempting to rotate our production API keys via the admin portal, but we keep receiving a "503 Service Unavailable" error when clicking the "Generate New Key" button.</p>
                    <p>This is critical as our current keys expire in 48 hours. I've attached a screenshot of the console log.</p>

                    <div className="attachment-card">
                      <div className="file-icon orange-bg">
                        <img src={galleryIcon} alt="Gallery" className="attachment-icon" />
                      </div>
                      <div className="file-info">
                        <span className="filename">console_error_log.png</span>
                        <span className="filesize">1.2 MB • Click to preview</span>
                      </div>
                      <button className="btn-download">
                        <img src={vectorDownloadIcon} alt="Download" className="download-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="message-row agent">
                <div className="message-body">
                  <div className="message-meta align-right">
                    <span className="time">10:55 AM</span> <strong>Alex Rivera</strong> <span className="tag-ar">AR</span>
                  </div>
                  <div className="message-bubble dark-bubble">
                    <p>Hello Marcus, thank you for reaching out. I've investigated our load balancer logs for your organization's ID.</p>
                    <p>It seems there's a transient rate-limiting issue affecting the Key Generation service specifically for your region. I am escalating this to our DevOps team immediately to increase your threshold.</p>
                  </div>
                </div>
              </div>

            </div>

            <div className="editor-container">
              <div className="editor-toolbar">
                <div className="tools-left">
                  <button className="tool-btn"><strong>B</strong></button>
                  <button className="tool-btn"><em>I</em></button>
                  <button className="tool-btn">≡</button>
                  <button className="tool-btn">{"<>"}</button>
                </div>
                <div className="tools-right">
                  <label className="checkbox-label">
                    <input type="checkbox" /> Internal Note
                  </label>
                </div>
              </div>
              <textarea className="editor-textarea" placeholder="Type your message here..."></textarea>
              <div className="editor-footer">
                <button className="btn-attach">
                  <img src={attachFileIcon} alt="Attach" className="attach-icon" />
                  Attach files
                </button>
                <button className="btn-send">Send Reply ➔</button>
              </div>
            </div>
          </section>

          <aside className="ticket-sidebar">

            {/* Card 1: Control Panel */}
            <div className="sidebar-card">
              <div className="card-header">
                <h3>CONTROL PANEL</h3>
                <img src={lockIcon} alt="Lock" className="card-icon" />
              </div>

              <div className="form-group">
                <label>Status</label>
                <div className="select-wrapper">
                  <select>
                    <option>In-progress</option>
                    <option>Resolved</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Priority Level</label>
                <div className="segmented-control">
                  <button>Low</button>
                  <button>Med</button>
                  <button className="active">High</button>
                </div>
              </div>
            </div>

            {/* Card 2: Assigned Agent */}
            <div className="sidebar-card">
              <label className="section-title">ASSIGNED AGENT</label>
              <div className="agent-card-inner">
                <img src="https://i.pravatar.cc/150?u=alex" alt="Agent" />
                <div className="agent-info">
                  <strong>Alex Rivera</strong>
                  <span className="text-orange">ASSIGNED TO YOU</span>
                </div>
                <button className="btn-swap">⇅</button>
              </div>
            </div>

            {/* Card 3: Service Level */}
            <div className="sidebar-card">
              <label className="section-title">SERVICE LEVEL</label>
              <div className="sla-row">
                <div className="sla-label">
                  <img src={groupDueInIcon} alt="Due In" className="sla-icon" />
                  SLA Due in
                </div>
                <span className="badge-green">2h 15m</span>
              </div>
              <div className="sla-row">
                <div className="sla-label">
                  <img src={vectorFirstResponseIcon} alt="First Response" className="sla-icon" />
                  First Response
                </div>
                <span className="sla-value">13m</span>
              </div>
              <div className="sla-row">
                <div className="sla-label">
                  <img src={vectorServiceTierIcon} alt="Service Tier" className="sla-icon" />
                  Service Tier
                </div>
                <span className="badge-platinum">Platinum</span>
              </div>
            </div>

            <div className="sidebar-footer-link">
              <button>
                <img src={archiveIcon} alt="Archive" className="archive-icon" />
                Archive & Close Ticket
              </button>
            </div>

          </aside>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;