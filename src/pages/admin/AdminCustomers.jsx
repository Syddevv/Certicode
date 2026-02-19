import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../styles/adminCustomers.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import notifBell from "../../assets/NotifBell.png";
import totalCustomersIcon from "../../assets/total-customers.png";
import activeCustomersIcon from "../../assets/active-customers.png";
import totalRevenueIcon from "../../assets/total-revenue.png";
import avgCustomerSpentIcon from "../../assets/avg-customer-spent.png";
import { AdminCustomersAPI } from "../../services/AdminCustomersAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

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

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    total_revenue: 0,
    avg_order_value: 0,
    total_customers_change: 0,
    active_customers_change: 0,
    total_revenue_change: 0,
    avg_order_value_change: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [perPage] = useState(10);
  const [exporting, setExporting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await AdminCustomersAPI.getCustomerStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdminCustomersAPI.getCustomers(currentPage, searchTerm, statusFilter, perPage);
      setCustomers(data.customers.data || data.customers);
      setTotalPages(data.pagination?.total_pages || data.customers.last_page || 1);
      setTotalItems(data.pagination?.total_items || data.customers.total || 0);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, perPage]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterClick = (filter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await AdminCustomersAPI.exportCustomers();
      showSuccessToast("Customer export started successfully.");
    } catch (error) {
      console.error("Error exporting customers:", error);
      showErrorToast(`Failed to export customer data: ${error.message || "Unknown error"}`);
    } finally {
      setExporting(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatPercentage = (percentage) => {
    if (percentage === undefined || percentage === null) return "0%";
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (customer) => {
    const hasOrders = customer.total_orders > 0;
    
    return hasOrders ? (
      <span className="status-badge active">● ACTIVE</span>
    ) : (
      <span className="status-badge suspended">● INACTIVE</span>
    );
  };

  const Avatar = ({ name, avatarUrl }) => (
    <img
      src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=128`}
      alt={name}
      className="avatar-img"
    />
  );

  const getPurchaseBadge = (orderCount) => {
    if (orderCount === 0) {
      return (
        <div className="purchase-count">
          <span className="purchase-badge zero">{orderCount} orders</span>
        </div>
      );
    } else if (orderCount <= 3) {
      return (
        <div className="purchase-count">
          <span className="purchase-badge low">{orderCount} orders</span>
        </div>
      );
    } else if (orderCount <= 10) {
      return (
        <div className="purchase-count">
          <span className="purchase-badge medium">{orderCount} orders</span>
        </div>
      );
    } else {
      return (
        <div className="purchase-count">
          <span className="purchase-badge high">{orderCount} orders</span>
        </div>
      );
    }
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
        </button>
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
            <button 
              className="page-btn" 
              onClick={() => handlePageChange(1)}
            >
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

      <div className="layout">
        <Sidebar activePage="customers" />

        <main className="main">
          <AdminTopbar 
            showHamburger
            onSearch={handleSearch}
          >
            <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
              <img src={notifBell} alt="Notifications" className="notification-icon" />
              <span className="notification-dot" />
            </Link>
            <button 
              className="btn primary" 
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? "Exporting..." : `${Icons.Export} Export`}
            </button>
          </AdminTopbar>

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
                <span className={`badge ${stats.total_customers_change >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercentage(stats.total_customers_change)}
                </span>
              </div>
              <small>TOTAL CUSTOMERS</small>
              <h3>{stats.total_customers}</h3>
            </div>

            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box orange">
                  <img src={activeCustomersIcon} alt="Active Customers" className="stat-icon-img" />
                </div>
                <span className={`badge ${stats.active_customers_change >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercentage(stats.active_customers_change)}
                </span>
              </div>
              <small>ACTIVE CUSTOMERS</small>
              <h3>{stats.active_customers}</h3>
            </div>

            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box blue">
                  <img src={totalRevenueIcon} alt="Total Revenue" className="stat-icon-img" />
                </div>
                <span className={`badge ${stats.total_revenue_change >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercentage(stats.total_revenue_change)}
                </span>
              </div>
              <small>TOTAL REVENUE</small>
              <h3>{formatCurrency(stats.total_revenue)}</h3>
            </div>

            <div className="stat-card">
              <div className="card-top">
                <div className="icon-box purple">
                  <img src={avgCustomerSpentIcon} alt="Avg Customer Spent" className="stat-icon-img" />
                </div>
                <span className={`badge ${stats.avg_order_value_change >= 0 ? 'positive' : 'negative'}`}>
                  {formatPercentage(stats.avg_order_value_change)}
                </span>
              </div>
              <small>AVG. CUSTOMER SPENT</small>
              <h3>{formatCurrency(stats.avg_order_value)}</h3>
            </div>
          </div>

          <div className="content-box">
            <div className="toolbar">
              <div className="left-controls">
                <div className="tab-switcher">
                  <button 
                    className={`tab-btn ${statusFilter === "all" ? "active" : ""}`}
                    onClick={() => handleFilterClick("all")}
                  >
                    All
                  </button>
                  <button 
                    className={`tab-btn ${statusFilter === "active" ? "active" : ""}`}
                    onClick={() => handleFilterClick("active")}
                  >
                    Active
                  </button>
                  <button 
                    className={`tab-btn ${statusFilter === "inactive" ? "active" : ""}`}
                    onClick={() => handleFilterClick("inactive")}
                  >
                    Inactive
                  </button>
                </div>
              </div>

              <div className="right-controls">
                <div className="view-toggle">
                  <button className="toggle-btn active">{Icons.List}</button>
                  <button className="toggle-btn">{Icons.Grid}</button>
                </div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>CUSTOMER {Icons.Sort}</th>
                  <th style={{ width: "20%" }}>PURCHASES {Icons.Sort}</th>
                  <th style={{ width: "20%" }}>TOTAL SPENT {Icons.Sort}</th>
                  <th style={{ width: "15%" }}>STATUS {Icons.Sort}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="loading-cell">
                      Loading customers...
                    </td>
                  </tr>
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data-cell">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="user-cell">
                          <Avatar name={customer.name} avatarUrl={customer.avatar_url} />
                          <div>
                            <Link 
                              to={`/customers/${customer.id}`}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <strong>{customer.name}</strong>
                            </Link>
                            <span className="email">{customer.email}</span>
                            <span className="join-date">Joined: {formatDate(customer.created_at)}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        {getPurchaseBadge(customer.total_orders || 0)}
                      </td>
                      <td className="amount">{formatCurrency(customer.total_spent)}</td>
                      <td>
                        {getStatusBadge(customer)}
                      </td>
                      {/* <td className="actions">
                        <Link to={`/customers/${customer.id}`}>
                          <button className="more-btn">{Icons.MoreVertical}</button>
                        </Link>
                      </td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination-bar">
              <span>
                Showing <strong>{((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalItems)}</strong> of {totalItems} customers
              </span>
              {renderPagination()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminCustomers;
