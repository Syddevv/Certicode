import React from "react";
import { Link } from "react-router-dom";
import "../../styles/adminCustomerDetails.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import notifBell from "../../assets/NotifBell.png";

const Icons = {
  Download: "↓",
  Eye: "👁",
  Edit: "📝",
  Settings: "⚙️",
  Dot: "●",
  Calendar: "📅",
};

const AdminCustomerDetails = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="customers" />

        <main className="main">
          <AdminTopbar showHamburger>
            <Link to="/admin-notification" className="notification-link">
              <img src={notifBell} alt="Notifications" className="notification-icon" />
              <span className="notification-dot" />
            </Link>
            <button className="btn primary">
              📥 Export Profile
            </button>
          </AdminTopbar>

          <div className="breadcrumb">
            <Link to="/customers" className="breadcrumb-link">Customers</Link> 
            <span className="separator">›</span> 
            <span className="current">James Smith</span>
          </div>

          <div className="details-layout">
            
            {/* LEFT COLUMN: PROFILE CARD */}
            <aside className="profile-card">
              <div className="profile-header">
                <img 
                  src="https://ui-avatars.com/api/?name=James+Smith&background=random&size=128" 
                  alt="James Smith" 
                  className="profile-large-avatar"
                />
                <h2>James Smith</h2>
                <a href="mailto:james.smith@email.com" className="profile-email">james.smith@email.com</a>
                <p className="join-date">Joined: Jan 24, 2024</p>
                <div className="profile-status">
                  <span className="status-pill active">● ACTIVE</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="info-section">
                <h4>Contact Information</h4>
                <div className="info-row">
                  <span className="label">Phone No.</span>
                  <span className="value">+639123456789</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="info-section">
                <h4>Business Information</h4>
                <div className="info-row">
                  <span className="label">Name</span>
                  <span className="value">SupSoft Tech</span>
                </div>
              </div>

              <hr className="divider" />

              <div className="info-section">
                <h4>Delivery Address</h4>
                <p className="address-text">
                  Visayas Ave, Quezon City,<br />
                  Metro Manila 1300,<br />
                  Philippines
                </p>
              </div>
            </aside>

            {/* RIGHT COLUMN: STATS & TRANSACTIONS */}
            <div className="content-area">
              
              {/* Top Stats Row */}
              <div className="details-stats-grid">
                <div className="detail-stat-card">
                  <small>TOTAL SPENT</small>
                  <h3>$5,460.00</h3>
                </div>
                <div className="detail-stat-card">
                  <small>TOTAL ORDERS</small>
                  <h3>5 orders</h3>
                </div>
                <div className="detail-stat-card">
                  <small>LAST ORDER DATE</small>
                  <h3>Dec 20, 2025</h3>
                </div>
              </div>

              {/* Transaction History Section (Replicated from AdminSales) */}
              <div className="order-history-box">
                <div className="section-header">
                  <h3>Transaction History</h3>
                </div>

                <div className="table-responsive">
                  <table className="sales-style-table">
                    <thead>
                      <tr>
                        <th style={{ width: "15%" }}>ORDER ID</th>
                        <th style={{ width: "35%" }}>ASSET NAME</th>
                        <th style={{ width: "20%" }}>DATE / TIME</th>
                        <th style={{ width: "15%" }}>AMOUNT</th>
                        <th style={{ width: "15%" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1 */}
                      <tr>
                        <td className="order-id">#ORD-8273</td>
                        <td>
                          <div className="asset-info">
                            <Link to="/sales/order-details" style={{ textDecoration: 'none', color: 'inherit' }}>
                              <strong>E-commerce SaaS Template</strong>
                            </Link>
                            <span className="mini-badge blue">WEB APP</span>
                          </div>
                        </td>
                        <td className="date-cell">
                          <div>Dec 20, 2025</div>
                          <small>14:24 PM</small>
                        </td>
                        <td className="amount">$999.00</td>
                        <td>
                          <span className="status-pill completed">
                            {Icons.Dot} COMPLETED
                          </span>
                        </td>
                      </tr>

                      {/* Row 2 */}
                      <tr>
                        <td className="order-id">#ORD-8265</td>
                        <td>
                          <div className="asset-info">
                            <strong>FoodieExpress Delivery App</strong>
                            <span className="mini-badge green">MOBILE APP</span>
                          </div>
                        </td>
                        <td className="date-cell">
                          <div>Nov 30, 2025</div>
                          <small>09:15 AM</small>
                        </td>
                        <td className="amount">$1,499.00</td>
                        <td>
                          <span className="status-pill pending">
                            {Icons.Dot} PENDING
                          </span>
                        </td>
                      </tr>

                      {/* Row 3 */}
                      <tr>
                        <td className="order-id">#ORD-8199</td>
                        <td>
                          <div className="asset-info">
                            <strong>FinTech Banking Dashboard</strong>
                            <span className="mini-badge purple">UI/UX KITS</span>
                          </div>
                        </td>
                        <td className="date-cell">
                          <div>Oct 22, 2025</div>
                          <small>16:45 PM</small>
                        </td>
                        <td className="amount">$450.00</td>
                        <td>
                          <span className="status-pill refunded">
                            {Icons.Dot} REFUNDED
                          </span>
                        </td>
                      </tr>
                      
                       {/* Row 4 */}
                      <tr>
                        <td className="order-id">#ORD-8150</td>
                        <td>
                          <div className="asset-info">
                            <strong>FitLife Tracker</strong>
                            <span className="mini-badge green">MOBILE APP</span>
                          </div>
                        </td>
                        <td className="date-cell">
                          <div>Sep 10, 2025</div>
                          <small>11:20 AM</small>
                        </td>
                        <td className="amount">$1,250.00</td>
                        <td>
                          <span className="status-pill completed">
                            {Icons.Dot} COMPLETED
                          </span>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>

                <div className="details-pagination">
                  <span>Showing <strong>1-4</strong> of 5 transactions</span>
                  <div className="nav-controls">
                    <button className="nav-btn" disabled>‹</button>
                    <button className="nav-btn active">1</button>
                    <button className="nav-btn" disabled>›</button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default AdminCustomerDetails;