import React from "react";
import "../../styles/adminDashboard.css";
import Sidebar from "../../components/Sidebar";
import revenueIcon from "../../assets/revenue.png";
import totalProjectsIcon from "../../assets/total-projects.png";
import newCustomerIcon from "../../assets/new-customer.png";
import assetUpdatedIcon from "../../assets/asset-updated.png";
import newSaleIcon from "../../assets/new-sale-e-commerce.png";
import auditCompletedIcon from "../../assets/audit-completed.png";
import addedNewProjectIcon from "../../assets/added-new-project.png";
import notifIcon from "../../assets/notif.png";

const Icons = {
  Bell: "🔔",
  Add: "+",
  More: "⋮",
  Export: "📥",
  Filter: "⚡",
  Edit: "📝",
  Settings: "⚙️",
  Doc: "📄",
  Dot: "●"
};

const Avatar = ({ name }) => (
  <img
    src={`https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=128`}
    alt={name}
    className="user-avatar"
  />
);

const AdminDashboard = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="dashboard" />

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
              <button className="btn primary">+ Add New Asset</button>
            </div>
          </div>

          <div className="page-header">
            <h2>Admin Dashboard Overview</h2>
          </div>
          <p className="subtitle">
            Welcome back, Admin. Here's what's happening with CertiCode today.
          </p>

          <section className="cards">
            <div className="card">
              <div className="card-top">
                <div className="card-icon blue">
                  <img src={revenueIcon} alt="Revenue" className="revenue-icon" />
                </div>
                <span className="badge positive">+12.5%</span>
              </div>
              <span className="card-label">TOTAL REVENUE</span>
              <h3>$124,500.00</h3>
            </div>

            <div className="card">
              <div className="card-top">
                <div className="card-icon purple">
                  <img src={totalProjectsIcon} alt="Total Projects" className="total-projects-icon" />
                </div>
                <span className="badge neutral">Stable</span>
              </div>
              <span className="card-label">TOTAL PROJECTS</span>
              <h3>24</h3>
            </div>

            <div className="card">
              <div className="card-top">
                <div className="card-icon orange">
                  <img src={newCustomerIcon} alt="New Customer" className="new-customer-icon" />
                </div>
                <span className="badge positive">+5.2%</span>
              </div>
              <span className="card-label">TOTAL CUSTOMERS</span>
              <h3>1,284</h3>
            </div>

            <div className="card">
              <div className="card-top">
                <div className="card-icon green">
                  <img src={assetUpdatedIcon} alt="Asset Updated" className="asset-updated-icon" />
                </div>
                <span className="badge positive">+2.8%</span>
              </div>
              <span className="card-label">AVG. ORDER VALUE</span>
              <h3>$1,500.00</h3>
            </div>
          </section>

          <section className="content">

            <div className="box sales-box">
              <div className="box-header">
                <div>
                  <h4>Sales Overview</h4>
                  <p className="sales-subtitle">
                    Revenue growth over the last 6 months
                  </p>
                </div>
                <select className="chart-select">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>

              <div className="chart-container">
                <div className="chart">
                  <div className="bar-group">
                    <div className="bar" style={{ height: "40%" }}></div>
                    <span className="label">JAN</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: "55%" }}></div>
                    <span className="label">FEB</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar highlight" style={{ height: "80%" }}>
                      <div className="tooltip">52k</div>
                    </div>
                    <span className="label">MAR</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: "65%" }}></div>
                    <span className="label">APR</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: "45%" }}></div>
                    <span className="label">MAY</span>
                  </div>
                  <div className="bar-group">
                    <div className="bar" style={{ height: "75%" }}></div>
                    <span className="label">JUN</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="box activity-box">
              <div className="box-header">
                <h4>Recent Activities</h4>
                <a href="#" className="view-all">View All</a>
              </div>

              <ul className="activities-list">
                <li>
                  <div className="activity-icon blue">
                    <img src={newSaleIcon} alt="New Sale" className="activity-icon-img" />
                  </div>
                  <div className="activity-info">
                    <strong>New Sale: E-commerce SaaS..</strong>
                    <small>2 mins ago by Admin</small>
                  </div>
                </li>
                <li>
                  <div className="activity-icon green">
                    <img src={assetUpdatedIcon} alt="Asset Updated" className="activity-icon-img" />
                  </div>
                  <div className="activity-info">
                    <strong>Asset Updated: Foodie Express..</strong>
                    <small>45 mins ago</small>
                  </div>
                </li>
                <li>
                  <div className="activity-icon orange">
                    <img src={newCustomerIcon} alt="New Customer" className="activity-icon-img" />
                  </div>
                  <div className="activity-info">
                    <strong>New Customer Registered</strong>
                    <small>3 hours ago</small>
                  </div>
                </li>
                <li>
                  <div className="activity-icon purple">
                    <img src={auditCompletedIcon} alt="Audit Completed" className="activity-icon-img" />
                  </div>
                  <div className="activity-info">
                    <strong>Audit Completed</strong>
                    <small>5 hours ago</small>
                  </div>
                </li>
                <li>
                  <div className="activity-icon yellow">
                    <img src={addedNewProjectIcon} alt="Added New Project" className="activity-icon-img" />
                  </div>
                  <div className="activity-info">
                    <strong>Added New Project Completed</strong>
                    <small>8 hours ago</small>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section className="box orders-box">
            <div className="box-header">
              <h4>Recent Orders</h4>
              <button className="export-btn">Export CSV</button>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "30%" }}>ASSET NAME</th>
                    <th style={{ width: "20%" }}>CUSTOMER</th>
                    <th style={{ width: "15%" }}>DATE</th>
                    <th style={{ width: "15%" }}>AMOUNT</th>
                    <th style={{ width: "10%" }}>STATUS</th>
                    <th style={{ width: "10%", textAlign: "right" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="asset-cell">
                        <div className="asset-icon blue">
                          <img src={newSaleIcon} alt="New Sale" className="asset-icon-img" />
                        </div>
                        <div>
                          <strong>E-commerce SaaS Template</strong>
                          <small>React + Node.js + Stripe</small>
                        </div>
                      </div>
                    </td>
                    <td>Enterprise Solution Inc.</td>
                    <td>Oct 24, 2023</td>
                    <td className="amount">$999.00</td>
                    <td>
                      <span className="status-pill completed">
                        {Icons.Dot} COMPLETED
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div className="action-buttons right">
                        <button>{Icons.Doc}</button>
                        <button>{Icons.Settings}</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;