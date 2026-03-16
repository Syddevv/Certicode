import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../styles/adminSales.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import notifBell from "../../assets/NotifBell.png";
import { AdminSalesAPI } from "../../services/AdminSalesAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import ExportConfirmation from "../../components/ExportConfirmationModal";
import {
  formatAdminCurrency,
  loadAdminPlatformPreferences,
  subscribeAdminPlatformPreferences,
} from "../../utils/adminPlatformPreferences";

const Icons = {
  Bell: "🔔",
  Export: "📥",
  Filter: "⚡",
  Edit: "📝",
  Settings: "⚙️",
  Dot: "●",
};

const Avatar = ({ name, avatarUrl }) => (
  <img
    src={
      avatarUrl ||
      `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`
    }
    alt={name}
    className="user-avatar"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
    }}
  />
);

const AdminSales = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    gross_volume: 0,
    net_revenue: 0,
    refund_rate: 0,
    avg_transaction: 0,
    gross_volume_change: 0,
    net_revenue_change: 0,
    refund_rate_change: 0,
    avg_transaction_change: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [platformPreferences, setPlatformPreferences] = useState(() =>
    loadAdminPlatformPreferences(),
  );
  const [filters, setFilters] = useState({
    date_range: "30",
    category: "all",
    status: "all",
    search: "",
  });

  const fetchStats = useCallback(async () => {
    try {
      const data = await AdminSalesAPI.getSalesStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdminSalesAPI.getOrders(currentPage, filters);
      setOrders(data.orders.data || data.orders);
      setTotalPages(data.pagination?.total_pages || data.orders.last_page || 1);
      setTotalItems(data.pagination?.total_items || data.orders.total || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    setPlatformPreferences(loadAdminPlatformPreferences());
    return subscribeAdminPlatformPreferences((nextPreferences) => {
      setPlatformPreferences(nextPreferences);
    });
  }, []);

  const handleSearch = (term) => {
    setFilters((prev) => ({ ...prev, search: term }));
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleExport = async () => {
    setShowExportModal(false);
    setExporting(true);
    try {
      await AdminSalesAPI.exportOrders(filters);
      showSuccessToast("Sales export started successfully.");
    } catch (error) {
      console.error("Error exporting orders:", error);
      showErrorToast(
        `Failed to export sales data: ${error.message || "Unknown error"}`,
      );
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    return formatAdminCurrency(amount ?? 0, platformPreferences.currency);
  };

  const formatPercentage = (percentage) => {
    if (percentage === undefined || percentage === null) return "0%";
    return `${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status) => {
    const statusKey = String(status || "pending").toLowerCase();
    const statusMap = {
      completed: "completed",
      paid: "completed",
      pending: "pending",
      processing: "pending",
      refunded: "refunded",
      cancelled: "refunded",
      failed: "refunded",
    };

    const badgeClass = statusMap[statusKey] || "pending";

    return (
      <span className={`status-pill ${badgeClass}`}>
        {Icons.Dot} {statusKey.toUpperCase()}
      </span>
    );
  };

  const getCategoryBadge = (category) => {
    const categoryKey = String(category || "website").toLowerCase();
    const categoryMap = {
      "mobile app": "green",
      website: "blue",
      "ui kit": "purple",
      "custom projects": "orange",
      "desktop app": "blue",
      "web app": "blue",
    };

    const badgeClass = categoryMap[categoryKey] || "blue";

    return (
      <span className={`mini-badge ${badgeClass}`}>
        {categoryKey.toUpperCase()}
      </span>
    );
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>,
      );
    }

    return (
      <div className="pagination-controls">
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {startPage > 1 && (
          <>
            <button className="page-btn" onClick={() => handlePageChange(1)}>
              1
            </button>
            {startPage > 2 && <span className="dots">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="dots">...</span>}
            <button
              className="page-btn"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          className="page-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    );
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout sales-page">
        <Sidebar activePage="sales" />

        <main className="main sales-main">
          <AdminTopbar onSearch={handleSearch}>
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
            <button
              className="btn primary"
              // onClick={handleExport}
              onClick={() => setShowExportModal(true)}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : `${Icons.Export} Export`}
            </button>
          </AdminTopbar>

          <div className="page-header">
            <div>
              <h2>Sales Management</h2>
              <p className="subtitle">
                Track and manage all digital asset transactions across
                CertiCode.
              </p>
            </div>
          </div>

          <div className="stats-grid sales-stats-grid">
            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-header">
                  <small>GROSS VOLUME</small>
                </div>
                <h3>{formatCurrency(stats.gross_volume)}</h3>
              </div>
              <span
                className={`trend-badge ${stats.gross_volume_change >= 0 ? "positive" : "negative"}`}
              >
                {formatPercentage(stats.gross_volume_change)}
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-header">
                  <small>NET REVENUE</small>
                </div>
                <h3>{formatCurrency(stats.net_revenue)}</h3>
              </div>
              <span
                className={`trend-badge ${stats.net_revenue_change >= 0 ? "positive" : "negative"}`}
              >
                {formatPercentage(stats.net_revenue_change)}
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-header">
                  <small>REFUND RATE</small>
                </div>
                <h3>{stats.refund_rate.toFixed(1)}%</h3>
              </div>
              <span
                className={`trend-badge ${stats.refund_rate_change <= 0 ? "positive" : "negative"}`}
              >
                {formatPercentage(stats.refund_rate_change)}
              </span>
            </div>

            <div className="stat-card">
              <div className="stat-card-content">
                <div className="stat-header">
                  <small>AVG. TRANSACTION</small>
                </div>
                <h3>{formatCurrency(stats.avg_transaction)}</h3>
              </div>
              <span
                className={`trend-badge ${stats.avg_transaction_change >= 0 ? "positive" : "negative"}`}
              >
                {formatPercentage(stats.avg_transaction_change)}
              </span>
            </div>
          </div>

          <div className="table-wrapper">
            <div className="filter-bar">
              <div className="filter-inputs">
                <div className="select-group">
                  <label>DATE RANGE:</label>
                  <select
                    value={filters.date_range}
                    onChange={(e) =>
                      handleFilterChange("date_range", e.target.value)
                    }
                  >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                    <option value="90">Last 90 Days</option>
                    <option value="365">Last Year</option>
                    <option value="all">All Time</option>
                  </select>
                </div>

                <div className="select-group">
                  <label>CATEGORY:</label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                  >
                    <option value="all">All Assets</option>
                    <option value="Website">Website</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI Kit">UI Kit</option>
                    <option value="Custom Projects">Custom Projects</option>
                  </select>
                </div>

                <div className="select-group">
                  <label>STATUS:</label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* <button className="filter-btn">
                {Icons.Filter} More Filters
              </button> */}
            </div>

            <div className="sales-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: "10%" }}>Order ID</th>
                    <th style={{ width: "25%" }}>Asset Name</th>
                    <th style={{ width: "20%" }}>Customer Name</th>
                    <th style={{ width: "15%" }}>Date / Time</th>
                    <th style={{ width: "10%" }}>Amount</th>
                    <th style={{ width: "12%" }}>Payment Status</th>
                    {/* <th style={{ width: "8%", textAlign: "center" }}>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="loading-cell">
                        Loading orders...
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="no-data-cell">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => {
                      const orderId =
                        order.id || order.order_id || order.order_number;
                      const rowKey =
                        orderId || `${order.order_number}-${order.asset_name}`;
                      return (
                        <tr key={rowKey}>
                          <td className="order-id">{order.order_number}</td>
                          <td>
                            <div className="asset-info">
                              {orderId ? (
                                <Link
                                  to={`/sales/order-details/${orderId}`}
                                  state={{ order }}
                                  style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                  }}
                                >
                                  <strong>{order.asset_name}</strong>
                                </Link>
                              ) : (
                                <strong>{order.asset_name}</strong>
                              )}
                              {getCategoryBadge(order.category)}
                            </div>
                          </td>
                          <td>
                            <div className="customer-info">
                              <Avatar
                                name={order.customer_name}
                                avatarUrl={order.customer_avatar}
                              />
                              <span>{order.customer_name}</span>
                            </div>
                          </td>
                          <td className="date-cell">
                            <div>{formatDate(order.purchased_at)}</div>
                            <small>{formatTime(order.purchased_at)}</small>
                          </td>
                          <td className="amount">
                            {formatCurrency(order.total_amount)}
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          {/* <td className="actions-cell">
                          <Link to={`/sales/order-details/${orderId}`}>
                            <button>{Icons.Edit}</button>
                          </Link>
                          <button>{Icons.Settings}</button>
                        </td> */}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination-bar">
              <span>
                Showing{" "}
                <strong>
                  {(currentPage - 1) * 10 + 1}-
                  {Math.min(currentPage * 10, totalItems)}
                </strong>{" "}
                of {totalItems} transactions
              </span>
              {renderPagination()}
            </div>
          </div>
        </main>
      </div>
      <ExportConfirmation
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onConfirm={handleExport}
      />
    </>
  );
};

export default AdminSales;
