import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../styles/adminDashboard.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import revenueIcon from "../../assets/revenue.png";
import totalProjectsIcon from "../../assets/total-projects.png";
import newCustomerIcon from "../../assets/new-customer.png";
import assetUpdatedIcon from "../../assets/asset-updated.png";
import newSaleIcon from "../../assets/new-sale-e-commerce.png";
import auditCompletedIcon from "../../assets/audit-completed.png";
import addedNewProjectIcon from "../../assets/added-new-project.png";
import notifBell from "../../assets/NotifBell.png";
import { AdminDashboardAPI } from "../../services/AdminDashboardAPI";
import {
  formatAdminCurrency,
  loadAdminPlatformPreferences,
  subscribeAdminPlatformPreferences,
} from "../../utils/adminPlatformPreferences";

const Icons = {
  Bell: "🔔",
  Add: "+",
  More: "⋮",
  Export: "📥",
  Filter: "⚡",
  Edit: "📝",
  Settings: "⚙️",
  Doc: "📄",
  Dot: "●",
};

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_revenue: 0,
    revenue_growth_percent: 0,
    total_projects: 0,
    project_growth_percent: 0,
    project_status: "neutral",
    total_customers: 0,
    customer_growth_percent: 0,
    avg_order_value: 0,
    avg_order_growth_percent: 0,
    recent_activities: [],
    recent_orders: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      has_more: false,
    },
  });

  const [salesData, setSalesData] = useState({
    months: [],
    revenue: [],
  });

  const [loading, setLoading] = useState({
    dashboard: true,
    sales: true,
    orders: true,
  });
  const [salesPeriod, setSalesPeriod] = useState("6months");
  const [currentPage, setCurrentPage] = useState(1);
  const [platformPreferences, setPlatformPreferences] = useState(() =>
    loadAdminPlatformPreferences(),
  );

  const fetchDashboardData = useCallback(async (page = 1) => {
    setLoading((prev) => ({ ...prev, dashboard: true, orders: true }));
    try {
      const data = await AdminDashboardAPI.getDashboardData(page);
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading((prev) => ({ ...prev, dashboard: false, orders: false }));
    }
  }, []);

  const fetchSalesOverview = useCallback(async (period) => {
    setLoading((prev) => ({ ...prev, sales: true }));
    try {
      const data = await AdminDashboardAPI.getSalesOverview(period);
      setSalesData(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading((prev) => ({ ...prev, sales: false }));
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(currentPage);
    fetchSalesOverview(salesPeriod);
  }, [currentPage, salesPeriod, fetchDashboardData, fetchSalesOverview]);

  useEffect(() => {
    setPlatformPreferences(loadAdminPlatformPreferences());
    return subscribeAdminPlatformPreferences((nextPreferences) => {
      setPlatformPreferences(nextPreferences);
    });
  }, []);

  const formatCurrency = (amount) => {
    return formatAdminCurrency(amount, platformPreferences.currency);
  };

  const formatPercent = (percent) => {
    if (percent > 0) {
      return `+${percent.toFixed(1)}%`;
    } else if (percent < 0) {
      return `${percent.toFixed(1)}%`;
    } else {
      return "0%";
    }
  };

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case "new_sale":
        return newSaleIcon;
      case "asset_updated":
        return assetUpdatedIcon;
      case "new_customer":
        return newCustomerIcon;
      case "audit_completed":
        return auditCompletedIcon;
      case "added_new_project":
        return addedNewProjectIcon;
      default:
        return newSaleIcon;
    }
  };

  const getStatusPillClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "status-pill completed";
      case "pending":
        return "status-pill pending";
      case "failed":
        return "status-pill failed";
      default:
        return "status-pill completed";
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="dashboard" />

        <main className="main">
          <AdminTopbar showHamburger showSearch={false}>
            <Link
              to="/admin-notification"
              className="notification-link"
              aria-label="Notifications"
            >
              <img
                src={notifBell}
                alt="Notifications"
                className="notification-icon"
              />
              <span className="notification-dot" />
            </Link>
            <Link to="/add-asset" className="btn primary">
              + Add New Asset
            </Link>
          </AdminTopbar>

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
                  <img
                    src={revenueIcon}
                    alt="Revenue"
                    className="revenue-icon"
                  />
                </div>
                {loading.dashboard ? (
                  <span className="badge neutral">...</span>
                ) : (
                  <span
                    className={`badge ${dashboardData.revenue_growth_percent >= 0 ? "positive" : "negative"}`}
                  >
                    {formatPercent(dashboardData.revenue_growth_percent)}
                  </span>
                )}
              </div>
              <span className="card-label">TOTAL REVENUE</span>
              <h3>
                {loading.dashboard
                  ? "..."
                  : formatCurrency(dashboardData.total_revenue)}
              </h3>
            </div>

            <div className="card">
              <div className="card-top">
                <div className="card-icon purple">
                  <img
                    src={totalProjectsIcon}
                    alt="Total Projects"
                    className="total-projects-icon"
                  />
                </div>
                {loading.dashboard ? (
                  <span className="badge neutral">...</span>
                ) : dashboardData.project_status === "neutral" ? (
                  <span className="badge neutral">Stable</span>
                ) : (
                  <span className={`badge ${dashboardData.project_status}`}>
                    {formatPercent(dashboardData.project_growth_percent)}
                  </span>
                )}
              </div>
              <span className="card-label">TOTAL PROJECTS</span>
              <h3>
                {loading.dashboard ? "..." : dashboardData.total_projects}
              </h3>
            </div>

            <div className="card">
              <div className="card-top">
                <div className="card-icon orange">
                  <img
                    src={newCustomerIcon}
                    alt="New Customer"
                    className="new-customer-icon"
                  />
                </div>
                {loading.dashboard ? (
                  <span className="badge neutral">...</span>
                ) : (
                  <span
                    className={`badge ${dashboardData.customer_growth_percent >= 0 ? "positive" : "negative"}`}
                  >
                    {formatPercent(dashboardData.customer_growth_percent)}
                  </span>
                )}
              </div>
              <span className="card-label">TOTAL CUSTOMERS</span>
              <h3>
                {loading.dashboard ? "..." : dashboardData.total_customers}
              </h3>
            </div>

            <div className="card">
              <div className="card-top">
                <div className="card-icon green">
                  <img
                    src={assetUpdatedIcon}
                    alt="Asset Updated"
                    className="asset-updated-icon"
                  />
                </div>
                {loading.dashboard ? (
                  <span className="badge neutral">...</span>
                ) : (
                  <span
                    className={`badge ${dashboardData.avg_order_growth_percent >= 0 ? "positive" : "negative"}`}
                  >
                    {formatPercent(dashboardData.avg_order_growth_percent)}
                  </span>
                )}
              </div>
              <span className="card-label">AVG. ORDER VALUE</span>
              <h3>
                {loading.dashboard
                  ? "..."
                  : formatCurrency(dashboardData.avg_order_value)}
              </h3>
            </div>
          </section>

          <section className="content">
            <div className="box sales-box">
              <div className="box-header">
                <div>
                  <h4>Sales Overview</h4>
                  <p className="sales-subtitle">
                    Revenue growth over the last{" "}
                    {salesPeriod === "year" ? "year" : "6 months"}
                  </p>
                </div>
                <select
                  className="chart-select"
                  value={salesPeriod}
                  onChange={(e) => setSalesPeriod(e.target.value)}
                >
                  <option value="6months">Last 6 Months</option>
                  <option value="year">Last Year</option>
                </select>
              </div>

              <div className="chart-container">
                {loading.sales ? (
                  <div className="loading-cell">Loading chart...</div>
                ) : salesData.revenue.length === 0 ? (
                  <div className="no-data-cell">No sales data available</div>
                ) : (
                  <div className="chart">
                    {salesData.revenue.map((revenue, index) => {
                      const maxRevenue = Math.max(...salesData.revenue);
                      const heightPercentage =
                        maxRevenue > 0 ? (revenue / maxRevenue) * 100 : 0;

                      return (
                        <div className="bar-group" key={index}>
                          <div
                            className={`bar ${revenue === maxRevenue ? "highlight" : ""}`}
                            style={{ height: `${heightPercentage}%` }}
                          >
                            {revenue > 0 && (
                              <div className="tooltip">
                                {formatCurrency(revenue)}
                              </div>
                            )}
                          </div>
                          <span className="label">
                            {salesData.months[index] || `Month ${index + 1}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="box activity-box">
              <div className="box-header">
                <h4>Recent Activities</h4>
                {/* <a href="#" className="view-all">View All</a> */}
              </div>

              {loading.dashboard ? (
                <div className="loading-cell">Loading activities...</div>
              ) : dashboardData.recent_activities.length === 0 ? (
                <div className="no-data-cell">No recent activities</div>
              ) : (
                <ul className="activities-list">
                  {dashboardData.recent_activities.map((activity, index) => (
                    <li key={index}>
                      <div
                        className={`activity-icon ${
                          activity.icon === "new_sale"
                            ? "blue"
                            : activity.icon === "asset_updated"
                              ? "green"
                              : activity.icon === "new_customer"
                                ? "orange"
                                : activity.icon === "audit_completed"
                                  ? "purple"
                                  : "yellow"
                        }`}
                      >
                        <img
                          src={getActivityIcon(activity.icon)}
                          alt={activity.title}
                          className="activity-icon-img"
                        />
                      </div>
                      <div className="activity-info">
                        <strong>{activity.title}</strong>
                        <small>{activity.time_ago}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="box orders-box">
            <div className="box-header">
              <h4>Recent Orders</h4>
            </div>

            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "35%" }}>ASSET NAME</th>
                    <th style={{ width: "25%" }}>CUSTOMER</th>
                    <th style={{ width: "15%" }}>DATE</th>
                    <th style={{ width: "15%" }}>AMOUNT</th>
                    <th style={{ width: "10%" }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {loading.orders ? (
                    <tr>
                      <td colSpan="5" className="loading-cell">
                        Loading orders...
                      </td>
                    </tr>
                  ) : dashboardData.recent_orders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-data-cell">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    dashboardData.recent_orders.map((order, index) => (
                      <tr key={index}>
                        <td>
                          <div className="asset-cell">
                            {order.product_featured_image ? (
                              <div className="asset-icon">
                                <img
                                  src={order.product_featured_image}
                                  alt={order.asset_name}
                                  className="asset-icon-img"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = newSaleIcon;
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="asset-icon blue">
                                <img
                                  src={newSaleIcon}
                                  alt={order.asset_name}
                                  className="asset-icon-img"
                                />
                              </div>
                            )}
                            <div>
                              <strong>{order.asset_name}</strong>
                              <small>
                                {Array.isArray(order.technologies)
                                  ? order.technologies.slice(0, 2).join(" + ") +
                                    (order.technologies.length > 2
                                      ? " +..."
                                      : "")
                                  : "Technologies not specified"}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="customer-cell">
                            <strong>{order.customer_name}</strong>
                          </div>
                        </td>
                        <td>{order.date}</td>
                        <td className="amount">
                          {formatCurrency(order.amount)}
                        </td>
                        <td>
                          <span className={getStatusPillClass(order.status)}>
                            {Icons.Dot}{" "}
                            {order.status?.toUpperCase() || "COMPLETED"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {!loading.orders && dashboardData.pagination.total > 10 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {dashboardData.pagination.current_page} of{" "}
                  {dashboardData.pagination.last_page}
                </span>
                <button
                  className="pagination-btn"
                  disabled={!dashboardData.pagination.has_more}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
