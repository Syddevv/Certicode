import React from "react";
import "../../styles/adminInventory.css";
import Sidebar from "../../components/Sidebar";
import webappsIcon from "../../assets/webapps.png";
import mobileIcon from "../../assets/mobile.png";
import notifIcon from "../../assets/notif.png";
import uiUxIcon from "../../assets/ui-ux.png";
import settingsCustomIcon from "../../assets/settings-custom.png";
import newSaleIcon from "../../assets/new-sale-e-commerce.png";
import assetUpdatedIcon from "../../assets/asset-updated.png";
import fintechIcon from "../../assets/fintech-banking.png";
import developerIcon from "../../assets/developer-portfolio.png";
import fitlifeIcon from "../../assets/fitlife-tracker.png";
import totalValueIcon from "../../assets/total-value.png";
import lastAuditIcon from "../../assets/last-audit.png";

const Icons = {
  Bell: "🔔",
  Add: "+",
  More: "⋮",
  Filter: "⚙️",
  Edit: "📝",
  Settings: "⚙️",
  Web: "🌐",
  Mobile: "📱",
  Design: "🎨",
  Value: "💰",
  Sales: "🛒",
  Audit: "⏱️"
};

const AdminInventory = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="inventory" />

        <main className="main">
          <div className="topbar">
            <label htmlFor="sidebar-toggle" className="hamburger">
              &#9776;
            </label>

            <div className="search-wrapper">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input className="search-input" placeholder="Search anything..." />
            </div>

            <div className="topbar-actions">
              <button className="notification">
                <img src={notifIcon} alt="Notification" className="notification-icon" />
              </button>
              <button className="btn primary">{Icons.Add} Add New Asset</button>
            </div>
          </div>

          <div className="page-header">
            <div>
              <h2>Admin Inventory Management</h2>
              <p className="subtitle">
                Track and manage all digital offerings from CertiCode repository.
              </p>
            </div>

            <div className="status-tabs">
              <button className="status-tab active">Active (24)</button>
              <button className="status-tab">Drafts (12)</button>
              <button className="status-tab">Archived</button>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <button className="filter-pill active">All Assets</button>
              <button className="filter-pill">
                <span>
                  <img src={webappsIcon} alt="Web Apps" className="filter-icon" />
                </span> Web Apps
              </button>
              <button className="filter-pill">
                <span>
                  <img src={mobileIcon} alt="Mobile Apps" className="filter-icon" />
                </span> Mobile Apps
              </button>
              <button className="filter-pill">
                <span>
                  <img src={uiUxIcon} alt="UI/UX Kits" className="filter-icon" />
                </span> UI/UX Kits
              </button>
              <button className="filter-pill">
                <span>
                  <img src={settingsCustomIcon} alt="Custom Projects" className="filter-icon" />
                </span> Custom Projects
              </button>
            </div>

            <button className="filter-pill outline">
              {Icons.Filter} More Filters
            </button>
          </div>

          {/* INVENTORY TABLE */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Asset Name</th>
                  <th style={{ width: "12%" }}>Category</th>
                  <th style={{ width: "20%" }}>Tech Stack</th>
                  <th style={{ width: "12%" }}>Price</th>
                  <th style={{ width: "12%" }}>Status</th>
                  <th style={{ width: "10%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* ROW 1 */}
                <tr>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon blue">
                        <img src={newSaleIcon} alt="New Sale" className="asset-icon-img" />
                      </div>
                      <div>
                        <strong>E-commerce SaaS Template</strong>
                        <small>Updated 2 days ago</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge gray">WEB APP</span></td>
                  <td className="tech-stack">React, Node.js, Stripe</td>
                  <td className="price">$999.00</td>
                  <td>
                    <div className="status-indicator active">
                      <span className="dot"></span> ACTIVE
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button>{Icons.Edit}</button>
                      <button>{Icons.Settings}</button>
                    </div>
                  </td>
                </tr>

                {/* ROW 2 */}
                <tr>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon green">
                        <img src={assetUpdatedIcon} alt="Asset Updated" className="asset-icon-img" />
                      </div>
                      <div>
                        <strong>Foodie Express Delivery App</strong>
                        <small>Updated 2 days ago</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge gray">MOBILE APP</span></td>
                  <td className="tech-stack">Flutter, Firebase, Node.js</td>
                  <td className="price">$1,499.00</td>
                  <td>
                    <div className="status-indicator active">
                      <span className="dot"></span> ACTIVE
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button>{Icons.Edit}</button>
                      <button>{Icons.Settings}</button>
                    </div>
                  </td>
                </tr>

                {/* ROW 3 */}
                <tr>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon orange">
                        <img src={fintechIcon} alt="Fintech Banking" className="asset-icon-img" />
                      </div>
                      <div>
                        <strong>Fintech Banking Dashboard</strong>
                        <small>Updated 2 days ago</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge gray">UI/UX KITS</span></td>
                  <td className="tech-stack">Figma, Adobe XD</td>
                  <td className="price">$450.00</td>
                  <td>
                    <div className="status-indicator active">
                      <span className="dot"></span> ACTIVE
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button>{Icons.Edit}</button>
                      <button>{Icons.Settings}</button>
                    </div>
                  </td>
                </tr>

                {/* ROW 4 */}
                <tr>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon purple">
                        <img src={developerIcon} alt="Developer Portfolio" className="asset-icon-img" />
                      </div>
                      <div>
                        <strong>Developer Portfolio Website</strong>
                        <small>Updated 2 days ago</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge gray">WEB APP</span></td>
                  <td className="tech-stack">React, Tailwind</td>
                  <td className="price">$199.00</td>
                  <td>
                    <div className="status-indicator draft">
                      <span className="dot"></span> DRAFT
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button>{Icons.Edit}</button>
                      <button>{Icons.Settings}</button>
                    </div>
                  </td>
                </tr>

                {/* ROW 5 */}
                <tr>
                  <td>
                    <div className="asset-cell">
                      <div className="asset-icon blue">
                        <img src={fitlifeIcon} alt="FitLife Tracker" className="asset-icon-img" />
                      </div>
                      <div>
                        <strong>FitLife Tracker Mobile App</strong>
                        <small>Updated 2 days ago</small>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge gray">MOBILE APP</span></td>
                  <td className="tech-stack">Flutter, Swift</td>
                  <td className="price">$1,250.00</td>
                  <td>
                    <div className="status-indicator active">
                      <span className="dot"></span> ACTIVE
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button>{Icons.Edit}</button>
                      <button>{Icons.Settings}</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pagination-bar">
              <span>Showing <strong>1-5</strong> of 48 assets</span>
              <div className="pagination-controls">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="dots">...</span>
                <button className="page-btn">12</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          </div>

          <div className="bottom-stats">
            <div className="stat-card">
              <div className="stat-icon-circle orange">
                <img src={totalValueIcon} alt="Total Value" className="stat-icon-img" />
              </div>
              <div>
                <small>TOTAL VALUE</small>
                <h3>$24,850.00</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-circle green">
                <img src={assetUpdatedIcon} alt="Monthly Sales" className="stat-icon-img" />
              </div>
              <div>
                <small>MONTHLY SALES</small>
                <h3>112 Items</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-circle blue">
                <img src={lastAuditIcon} alt="Last Audit" className="stat-icon-img" />
              </div>
              <div>
                <small>LAST AUDIT</small>
                <h3>14h Ago</h3>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default AdminInventory;