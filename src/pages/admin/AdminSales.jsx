import React from "react";
import "../../styles/adminSales.css";
import Sidebar from "../../components/Sidebar";
import notifIcon from "../../assets/notif.png";

// Icons
const Icons = {
  Bell: "🔔",
  Export: "📥",
  Filter: "⚡",
  Edit: "📝",
  Settings: "⚙️",
  Dot: "●"
};

// Avatar Helper
const Avatar = ({ name }) => (
  <img
    src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff`}
    alt={name}
    className="user-avatar"
  />
);

const AdminSales = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        {/* Active page Highlight */}
        <Sidebar activePage="sales" />

        <main className="main">
          {/* TOP BAR */}
          <div className="topbar">
            <label htmlFor="sidebar-toggle" className="hamburger">
              &#9776;
            </label>

            {/* FIXED SEARCH BAR WITH ICON */}
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
              <button className="btn primary">
                {Icons.Export} Export
              </button>
            </div>
          </div>

          {/* PAGE HEADER */}
          <div className="page-header">
            <div>
              <h2>Sales Management</h2>
              <p className="subtitle">
                Track and manage all digital asset transactions across CertiCode.
              </p>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <small>GROSS VOLUME</small>
              </div>
              <h3>$342,500.00</h3>
              <span className="trend-badge positive">+15.2%</span>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <small>NET REVENUE</small>
              </div>
              <h3>$283,240.60</h3>
              <span className="trend-badge positive">+5.2%</span>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <small>REFUND RATE</small>
              </div>
              <h3>1.2%</h3>
              <span className="trend-badge negative">-0.4%</span>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <small>AVG. TRANSACTION</small>
              </div>
              <h3>$485.20</h3>
              <span className="trend-badge positive">+3.2%</span>
            </div>
          </div>

          {/* FILTERS & TABLE CONTAINER */}
          <div className="table-wrapper">

            {/* FILTER BAR */}
            <div className="filter-bar">
              <div className="filter-inputs">
                <div className="select-group">
                  <label>DATE RANGE:</label>
                  <select defaultValue="30">
                    <option value="30">Last 30 Days</option>
                    <option value="7">Last 7 Days</option>
                  </select>
                </div>

                <div className="select-group">
                  <label>CATEGORY:</label>
                  <select defaultValue="all">
                    <option value="all">All Assets</option>
                    <option value="web">Web Apps</option>
                  </select>
                </div>

                <div className="select-group">
                  <label>STATUS:</label>
                  <select defaultValue="all">
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <button className="filter-btn">
                {Icons.Filter} More Filters
              </button>
            </div>

            {/* SALES TABLE */}
            <table>
              <thead>
                <tr>
                  <th style={{ width: "10%" }}>Order ID</th>
                  <th style={{ width: "25%" }}>Asset Name</th>
                  <th style={{ width: "20%" }}>Customer Name</th>
                  <th style={{ width: "15%" }}>Date / Time</th>
                  <th style={{ width: "10%" }}>Amount</th>
                  <th style={{ width: "12%" }}>Payment Status</th>
                  <th style={{ width: "8%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* ROW 1 - Completed */}
                <tr>
                  <td className="order-id">#ORD-94210</td>
                  <td>
                    <div className="asset-info">
                      <strong>E-commerce SaaS Template</strong>
                      <span className="mini-badge blue">WEB APP</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <Avatar name="James Wilson" />
                      <span>James Wilson</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    <div>Dec 5, 2025</div>
                    <small>14:24 PM</small>
                  </td>
                  <td className="amount">$999.00</td>
                  <td>
                    <span className="status-pill completed">
                      {Icons.Dot} COMPLETED
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button>{Icons.Edit}</button>
                    <button>{Icons.Settings}</button>
                  </td>
                </tr>

                {/* ROW 2 - Pending */}
                <tr>
                  <td className="order-id">#ORD-94209</td>
                  <td>
                    <div className="asset-info">
                      <strong>Foodie Express Delivery App</strong>
                      <span className="mini-badge green">MOBILE APP</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <Avatar name="James Naismith" />
                      <span>James Naismith</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    <div>Dec 1, 2025</div>
                    <small>14:04 PM</small>
                  </td>
                  <td className="amount">$1,499.00</td>
                  <td>
                    <span className="status-pill pending">
                      {Icons.Dot} PENDING
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button>{Icons.Edit}</button>
                    <button>{Icons.Settings}</button>
                  </td>
                </tr>

                {/* ROW 3 - Refunded */}
                <tr>
                  <td className="order-id">#ORD-94208</td>
                  <td>
                    <div className="asset-info">
                      <strong>Fintech Banking Dashboard</strong>
                      <span className="mini-badge purple">UI/UX KITS</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <Avatar name="James Lebron" />
                      <span>James Lebron</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    <div>Nov 25, 2025</div>
                    <small>04:14 PM</small>
                  </td>
                  <td className="amount">$450.00</td>
                  <td>
                    <span className="status-pill refunded">
                      {Icons.Dot} REFUNDED
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button>{Icons.Edit}</button>
                    <button>{Icons.Settings}</button>
                  </td>
                </tr>

                {/* ROW 4 - Completed */}
                <tr>
                  <td className="order-id">#ORD-94207</td>
                  <td>
                    <div className="asset-info">
                      <strong>FitLife Tracker Mobile App</strong>
                      <span className="mini-badge green">MOBILE APP</span>
                    </div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <Avatar name="James Harden" />
                      <span>James Harden</span>
                    </div>
                  </td>
                  <td className="date-cell">
                    <div>Nov 24, 2025</div>
                    <small>01:34 PM</small>
                  </td>
                  <td className="amount">$1,250.00</td>
                  <td>
                    <span className="status-pill completed">
                      {Icons.Dot} COMPLETED
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button>{Icons.Edit}</button>
                    <button>{Icons.Settings}</button>
                  </td>
                </tr>

              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination-bar">
              <span>Showing <strong>1-4</strong> of 1,248 transactions</span>
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
        </main>
      </div>
    </>
  );
};

export default AdminSales;