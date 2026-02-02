import React from "react";
import "../../styles/adminCustomers.css";
import Sidebar from "../../components/Sidebar";
import notifIcon from "../../assets/notif.png";
import totalCustomersIcon from "../../assets/total-customers.png";
import activeCustomersIcon from "../../assets/active-customers.png";
import totalRevenueIcon from "../../assets/total-revenue.png";
import avgCustomerSpentIcon from "../../assets/avg-customer-spent.png";
import filterIcon from "../../assets/filter.png";

const Icons = {
  Bell: "🔔",
  Export: "📥",
  Filter: "⚡",
  Grid: "⊞",
  List: "☰",
  MoreVertical: "⋮",
  Users: "👥",
  UserCheck: "👤",
  Dollar: "💲",
  Receipt: "🧾",
  Sort: "⇅"
};

const Avatar = ({ name }) => (
  <img
    src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`}
    alt={name}
    className="avatar-img"
  />
);

const AdminCustomers = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="customers" />

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
              <button className="btn primary">
                {Icons.Export} Export
              </button>
            </div>
          </div>

          <div className="page-header">
            <div>
              <h2>Customers</h2>
              <p className="subtitle">
                Manage and monitor B2B account activity and spending.
              </p>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box green">
                  <img src={totalCustomersIcon} alt="Total Customers" className="stat-icon-img" />
                </div>
                <span className="badge positive">+12%</span>
              </div>
              <small>TOTAL CUSTOMERS</small>
              <h3>1,284</h3>
            </div>

            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box orange">
                  <img src={activeCustomersIcon} alt="Active Customers" className="stat-icon-img" />
                </div>
                <span className="badge positive">+5%</span>
              </div>
              <small>ACTIVE CUSTOMERS</small>
              <h3>1,150</h3>
            </div>

            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box blue">
                  <img src={totalRevenueIcon} alt="Total Revenue" className="stat-icon-img" />
                </div>
                <span className="badge positive">+18%</span>
              </div>
              <small>TOTAL REVENUE</small>
              <h3>$10,356.00</h3>
            </div>

            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box purple">
                  <img src={avgCustomerSpentIcon} alt="Avg Customer Spent" className="stat-icon-img" />
                </div>
                <span className="badge negative">-2%</span>
              </div>
              <small>AVG. CUSTOMER SPENT</small>
              <h3>$485.20</h3>
            </div>
          </div>

          <div className="content-box">

            <div className="toolbar">
              <div className="left-controls">
                <div className="tab-switcher">
                  <button className="tab-btn active">All</button>
                  <button className="tab-btn">Active</button>
                  <button className="tab-btn">Suspended</button>
                </div>
                <button className="icon-btn">
                  <img src={filterIcon} alt="Filter" className="filter-icon" />
                </button>
              </div>

              <div className="right-controls">
                <div className="view-toggle">
                  <button className="toggle-btn active">{Icons.List}</button>
                  <button className="toggle-btn">{Icons.Grid}</button>
                </div>
              </div>
            </div>

            {/* CUSTOMERS TABLE */}
            <table>
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>CUSTOMER {Icons.Sort}</th>
                  <th style={{ width: "20%" }}>PURCHASES {Icons.Sort}</th>
                  <th style={{ width: "20%" }}>TOTAL SPENT {Icons.Sort}</th>
                  <th style={{ width: "15%" }}>STATUS {Icons.Sort}</th>
                  <th style={{ width: "10%" }}></th>
                </tr>
              </thead>
              <tbody>
                {/* ROW 1 */}
                <tr>
                  <td>
                    <div className="user-cell">
                      <Avatar name="James Smith" />
                      <div>
                        <strong>James Smith</strong>
                        <span className="email">james.smith@email.com</span>
                      </div>
                    </div>
                  </td>
                  <td>5 orders</td>
                  <td className="amount">$5,460.00</td>
                  <td>
                    <span className="status-badge active">● ACTIVE</span>
                  </td>
                  <td className="actions">
                    <button className="more-btn">{Icons.MoreVertical}</button>
                  </td>
                </tr>

                {/* ROW 2 */}
                <tr>
                  <td>
                    <div className="user-cell">
                      <Avatar name="Olivia Carter" />
                      <div>
                        <strong>Olivia Carter</strong>
                        <span className="email">olivia.carter@email.com</span>
                      </div>
                    </div>
                  </td>
                  <td>2 orders</td>
                  <td className="amount">$2,350.00</td>
                  <td>
                    <span className="status-badge suspended">● SUSPENDED</span>
                  </td>
                  <td className="actions">
                    <button className="more-btn">{Icons.MoreVertical}</button>
                  </td>
                </tr>

                {/* ROW 3 */}
                <tr>
                  <td>
                    <div className="user-cell">
                      <Avatar name="Joshua Olsen" />
                      <div>
                        <strong>Joshua Olsen</strong>
                        <span className="email">joshua.olsen@email.com</span>
                      </div>
                    </div>
                  </td>
                  <td>12 orders</td>
                  <td className="amount">$12,400.00</td>
                  <td>
                    <span className="status-badge active">● ACTIVE</span>
                  </td>
                  <td className="actions">
                    <button className="more-btn">{Icons.MoreVertical}</button>
                  </td>
                </tr>

                {/* ROW 4 */}
                <tr>
                  <td>
                    <div className="user-cell">
                      <Avatar name="Joshua Olsen" />
                      <div>
                        <strong>Joshua Olsen</strong>
                        <span className="email">joshua.olsen@email.com</span>
                      </div>
                    </div>
                  </td>
                  <td>12 orders</td>
                  <td className="amount">$12,400.00</td>
                  <td>
                    <span className="status-badge active">● ACTIVE</span>
                  </td>
                  <td className="actions">
                    <button className="more-btn">{Icons.MoreVertical}</button>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination-bar">
              <span>Showing <strong>1-10</strong> of 1,284 customers</span>
              <div className="pagination-controls">
                <button className="page-btn">‹</button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="dots">...</span>
                <button className="page-btn">128</button>
                <button className="page-btn">›</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default AdminCustomers;