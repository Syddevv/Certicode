import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/adminVouchers.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import notifBell from "../../assets/NotifBell.png";
import TotalVouch from "../../assets/TotalVouch.png";
import ActiveVouch from "../../assets/ActiveVouch.png";
import UsedVouch from "../../assets/UsedVouch.png";
import VouchEdit from "../../assets/VouchEdit.png";
import VouchRemove from "../../assets/VouchRemove.png";
import PaginationLeft from "../../assets/PaginationLeft.png";
import PaginationRight from "../../assets/PaginationRight.png";
import ActiveFilter from "../../assets/ActiveFilter.png";
import Expiring from "../../assets/Expiring.png";
import Used from "../../assets/Used.png";
import FilterVouch from "../../assets/FilterVouch.png";
import { AdminPromoAPI } from "../../services/AdminPromoAPI";

const filters = ["All Coupon", "Active", "Expiring Soon", "Used"];

const filterIcons = {
  Active: ActiveFilter,
  "Expiring Soon": Expiring,
  Used: Used,
};

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [stats, setStats] = useState({
    total_vouchers: 0,
    active_vouchers: 0,
    total_uses: 0,
    expiring_soon: 0,
    expired_vouchers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All Coupon");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 5,
    total: 0
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchVouchers();
    fetchStats();
  }, [currentPage, selectedFilter]);

  useEffect(() => {
    const incomingVoucher = location.state?.newVoucher;
    const updatedVoucher = location.state?.updatedVoucher;
    
    if (incomingVoucher || updatedVoucher) {
      fetchVouchers();
      fetchStats();
      navigate("/vouchers", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      let status = "";
      if (selectedFilter === "Active") status = "active";
      else if (selectedFilter === "Expiring Soon") status = "expiring";
      else if (selectedFilter === "Used") status = "used";
      
      const response = await AdminPromoAPI.getVouchers(currentPage, 5, '', status);
      setVouchers(response.vouchers);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError("Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await AdminPromoAPI.getVoucherStats();
      setStats(response);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusAndTone = (voucher) => {
    const now = new Date();
    const validUntil = voucher.valid_until ? new Date(voucher.valid_until) : null;
    const validFrom = voucher.valid_from ? new Date(voucher.valid_from) : null;
    
    if (!voucher.is_active) {
      return { status: "INACTIVE", tone: "used" };
    }
    
    if (validFrom && validFrom > now) {
      return { status: "SCHEDULED", tone: "expiring" };
    }
    
    if (validUntil && validUntil < now) {
      return { status: "EXPIRED", tone: "used" };
    }
    
    if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
      return { status: "USED UP", tone: "used" };
    }
    
    if (validUntil) {
      const daysUntilExpiry = Math.ceil((validUntil - now) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 7) {
        return { status: "EXPIRING SOON", tone: "expiring" };
      }
    }
    
    return { status: "ACTIVE", tone: "active" };
  };

  const formatDiscount = (voucher) => {
    if (voucher.type === 'percentage') {
      return `${voucher.value}% OFF`;
    } else if (voucher.type === 'fixed') {
      return `$${parseFloat(voucher.value).toFixed(2)} OFF`;
    }
    return '';
  };

  const handleEdit = (voucher) => {
    navigate("/vouchers/edit", {
      state: { voucher: voucher }
    });
  };

  const handleDelete = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete voucher "${code}"?`)) {
      try {
        await AdminPromoAPI.deleteVoucher(id);
        fetchVouchers();
        fetchStats();
      } catch (error) {
        alert(error.message || "Failed to delete voucher");
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const statCards = [
    {
      label: "TOTAL VOUCHERS",
      value: stats.total_vouchers || 0,
      tone: "orange",
      icon: TotalVouch,
    },
    {
      label: "ACTIVE VOUCHERS",
      value: stats.active_vouchers || 0,
      tone: "green",
      icon: ActiveVouch,
    },
    {
      label: "TOTAL USES",
      value: stats.total_uses || 0,
      tone: "blue",
      icon: UsedVouch,
    },
  ];

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />
      <div className="layout">
        <Sidebar activePage="vouchers" />
        <main className="main vouchers-main">
          <AdminTopbar showHamburger>
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
            <Link
              to="/vouchers/new"
              className="btn primary vouchers-add-btn"
            >
              <span className="vouchers-add-plus" aria-hidden="true">+</span>
              Add New Coupon
            </Link>
          </AdminTopbar>

          <div className="page-header">
            <h2>Voucher Management</h2>
            <p className="subtitle">
              Manage and control all discount vouchers in the CertiCode system.
            </p>
            {error && <div className="error-message">{error}</div>}
          </div>

          <section className="vouchers-stats-grid">
            {statCards.map((item) => (
              <article key={item.label} className="vouchers-stat-card">
                <div className={`vouchers-stat-icon ${item.tone}`}>
                  <img
                    src={item.icon}
                    alt=""
                    aria-hidden="true"
                    className="vouchers-stat-icon-img"
                  />
                </div>
                <div className="vouchers-stat-text">
                  <small>{item.label}</small>
                  <h3>{item.value.toLocaleString()}</h3>
                </div>
              </article>
            ))}
          </section>

          <section className="vouchers-table-box">
            <div className="vouchers-toolbar">
              <div className="vouchers-filters">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`vouchers-filter-pill ${selectedFilter === filter ? "active" : ""}`}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setCurrentPage(1);
                    }}
                  >
                    {filterIcons[filter] && (
                      <img
                        src={filterIcons[filter]}
                        alt=""
                        aria-hidden="true"
                        className="vouchers-filter-icon"
                      />
                    )}
                    {filter}
                  </button>
                ))}
              </div>
              <button type="button" className="vouchers-more-filters">
                <img
                  src={FilterVouch}
                  alt=""
                  aria-hidden="true"
                  className="vouchers-filter-icon"
                />
                More Filters
              </button>
            </div>

            <div className="vouchers-table-wrap">
              {loading ? (
                <div className="loading-state">Loading vouchers...</div>
              ) : (
                <table className="vouchers-table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>CODE</th>
                      <th>DISCOUNT</th>
                      <th>ACTIVE FROM</th>
                      <th>ACTIVE TO</th>
                      <th>USAGE LIMIT</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vouchers.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="voucher-empty-cell">
                          No vouchers found. Click "Add New Coupon" to create one.
                        </td>
                      </tr>
                    ) : (
                      vouchers.map((voucher) => {
                        const { status, tone } = getStatusAndTone(voucher);
                        return (
                          <tr key={voucher.id}>
                            <td className="voucher-name-cell">
                              <strong>{voucher.description || `Voucher ${voucher.code}`}</strong>
                              <span>Updated {new Date(voucher.updated_at).toLocaleDateString()}</span>
                            </td>
                            <td>
                              <span className="voucher-code">{voucher.code}</span>
                            </td>
                            <td>
                              <span className="voucher-discount">{formatDiscount(voucher)}</span>
                            </td>
                            <td>{voucher.valid_from ? formatDate(voucher.valid_from) : 'Immediate'}</td>
                            <td>{voucher.valid_until ? formatDate(voucher.valid_until) : 'No expiry'}</td>
                            <td className="voucher-usage-limit">
                              {voucher.max_uses ? `${voucher.used_count || 0}/${voucher.max_uses}` : 'Unlimited'}
                            </td>
                            <td>
                              <span className={`voucher-status ${tone}`}>
                                {status}
                              </span>
                            </td>
                            <td>
                              <div className="voucher-actions">
                                <button
                                  type="button"
                                  aria-label={`Edit ${voucher.code}`}
                                  onClick={() => handleEdit(voucher)}
                                >
                                  <img src={VouchEdit} alt="" aria-hidden="true" className="voucher-action-icon" />
                                </button>
                                <button
                                  type="button"
                                  aria-label={`Delete ${voucher.code}`}
                                  onClick={() => handleDelete(voucher.id, voucher.code)}
                                >
                                  <img src={VouchRemove} alt="" aria-hidden="true" className="voucher-action-icon" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {!loading && vouchers.length > 0 && (
              <div className="vouchers-pagination">
                <span>
                  Showing{" "}
                  <strong>
                    {(pagination.current_page - 1) * pagination.per_page + 1}-
                    {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                  </strong>{" "}
                  of {pagination.total} vouchers
                </span>
                <div className="vouchers-pagination-controls">
                  <button
                    type="button"
                    className="voucher-page-nav-btn"
                    aria-label="Previous page"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <img src={PaginationLeft} alt="" aria-hidden="true" className="voucher-page-nav-icon" />
                  </button>
                  
                  {[...Array(pagination.last_page)].map((_, i) => (
                    <button
                      key={i + 1}
                      type="button"
                      className={currentPage === i + 1 ? "active" : ""}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    className="voucher-page-nav-btn"
                    aria-label="Next page"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                  >
                    <img src={PaginationRight} alt="" aria-hidden="true" className="voucher-page-nav-icon" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminVouchers;