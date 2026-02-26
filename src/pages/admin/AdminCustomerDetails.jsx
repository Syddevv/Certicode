import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/adminCustomerDetails.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import notifBell from "../../assets/NotifBell.png";
import downloadIcon from "../../assets/whiteDownload.png";
import fallbackAvatar from "../../assets/default-profile.png";
import { resolveAvatarUrl } from "../../utils/avatar";
import { AdminCustomersAPI } from "../../services/AdminCustomersAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { downloadCustomerProfilePdf } from "../../utils/customerProfilePdf";

const PER_PAGE = 10;

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (value) => {
  const amount = toNumber(value) ?? 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (value, fallback = "") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatTime = (value, fallback = "") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatAddress = (address) => {
  if (!address) return "Not provided";

  if (typeof address === "string") {
    return address;
  }

  const line1 = [address.line1, address.line2].filter(Boolean).join(", ");
  const line2 = [address.city, address.state, address.postal_code || address.zip_code]
    .filter(Boolean)
    .join(", ");
  const line3 = address.country;

  return [line1, line2, line3].filter(Boolean).join("\n") || "Not provided";
};

const getCategoryBadgeClass = (category) => {
  const key = String(category || "website").toLowerCase();
  if (key.includes("mobile")) return "green";
  if (key.includes("ui") || key.includes("kit")) return "purple";
  return "blue";
};

const getStatusClass = (status) => {
  const key = String(status || "pending").toLowerCase();
  if (["completed", "paid", "success", "succeeded"].includes(key)) return "completed";
  if (["refunded", "cancelled", "failed"].includes(key)) return "refunded";
  return "pending";
};

const normalizeCustomer = (payload) => {
  if (!payload) return {};
  return payload.customer || payload.user || payload.data || payload;
};

const normalizeOrders = (payload) => {
  const source = payload?.orders || payload?.data || payload || [];
  if (Array.isArray(source)) {
    return {
      items: source,
      totalItems: source.length,
      totalPages: 1,
      currentPage: 1,
    };
  }

  return {
    items: source.data || [],
    totalItems: payload?.pagination?.total_items || source.total || 0,
    totalPages: payload?.pagination?.total_pages || source.last_page || 1,
    currentPage: payload?.pagination?.current_page || source.current_page || 1,
  };
};

const AdminCustomerDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const routeCustomer = location.state?.customer || null;

  const [customer, setCustomer] = useState(routeCustomer || null);
  const [orders, setOrders] = useState([]);
  const [loadingCustomer, setLoadingCustomer] = useState(!routeCustomer);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [exportingProfile, setExportingProfile] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        setError("Customer ID is missing from URL.");
        setLoadingCustomer(false);
        return;
      }

      setLoadingCustomer(true);
      setError("");

      try {
        const response = await AdminCustomersAPI.getCustomerDetails(id);
        const normalized = normalizeCustomer(response?.data ?? response);
        setCustomer((prev) => ({
          ...(prev || {}),
          ...(normalized || {}),
        }));
      } catch (fetchError) {
        const message = fetchError?.message || "Failed to load customer details.";
        if (!routeCustomer) {
          setError(message);
          showErrorToast(message);
        }
      } finally {
        setLoadingCustomer(false);
      }
    };

    fetchCustomer();
  }, [id, routeCustomer]);

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      if (!id) {
        setLoadingOrders(false);
        return;
      }

      setLoadingOrders(true);

      try {
        const response = await AdminCustomersAPI.getCustomerOrders(id, currentPage);
        const normalized = normalizeOrders(response);
        setOrders(normalized.items || []);
        setTotalPages(normalized.totalPages || 1);
        setTotalItems(normalized.totalItems || normalized.items.length || 0);
      } catch (fetchError) {
        console.error("Error fetching customer orders:", fetchError);
        setOrders([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchCustomerOrders();
  }, [id, currentPage]);

  const viewModel = useMemo(() => {
    if (!customer) return null;

    const totalSpent =
      toNumber(customer.total_spent) ??
      orders.reduce((sum, order) => sum + (toNumber(order.total_amount || order.amount) ?? 0), 0);

    const orderCount =
      toNumber(customer.total_orders) ??
      toNumber(customer.orders_count) ??
      totalItems;

    const latestOrderDate =
      customer.last_order_date ||
      customer.latest_order_date ||
      orders
        .map((order) => order.purchased_at || order.created_at || order.paid_at)
        .filter(Boolean)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ||
      null;

    const isActive =
      String(customer.status || "").toLowerCase() === "active" ||
      (orderCount ?? 0) > 0;

    return {
      id: customer.id || customer.customer_id || id,
      name: customer.name || "Customer",
      email: customer.email || "No email provided",
      joinedAt: formatDate(customer.created_at || customer.joined_at, "Not available"),
      avatar:
        resolveAvatarUrl(customer.avatar_url || customer.avatar) ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || "Customer")}&background=E5E7EB&color=111827&size=128`,
      phone: customer.phone || customer.phone_number || customer.mobile || "Not provided",
      company: customer.company || customer.company_name || "Not provided",
      address: formatAddress(customer.address || customer.billing_address || customer.delivery_address),
      statusLabel: isActive ? "ACTIVE" : "INACTIVE",
      statusClass: isActive ? "active" : "inactive",
      totalSpent: formatCurrency(totalSpent),
      totalOrders: Math.max(0, Number(orderCount || 0)),
      lastOrderDate: formatDate(latestOrderDate, "No orders yet"),
    };
  }, [customer, orders, totalItems, id]);

  const mappedOrders = useMemo(() => {
    return orders.map((order) => {
      const orderId = order.id || order.order_id || order.order_number;
      const orderDate = order.purchased_at || order.created_at || order.paid_at;
      const category = order.category || order.asset_category || "Website";
      const statusRaw = String(order.status || order.payment_status || "pending").toUpperCase();

      return {
        id: orderId,
        orderNumber: order.order_number || `#ORD-${orderId}`,
        assetName: order.asset_name || order.product_name || order.product?.name || "Digital Asset",
        category,
        amount: formatCurrency(order.total_amount || order.amount),
        dateLabel: formatDate(orderDate, "-"),
        timeLabel: formatTime(orderDate, "-"),
        statusLabel: statusRaw,
        statusClass: getStatusClass(statusRaw),
        rawOrder: order,
      };
    });
  }, [orders]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleExportProfile = async () => {
    if (!viewModel) return;

    try {
      setExportingProfile(true);
      const filename = downloadCustomerProfilePdf({
        customer: viewModel,
        transactions: mappedOrders,
      });
      showSuccessToast(
        `Print dialog opened for ${filename}. Choose "Save as PDF".`,
      );
    } catch (exportError) {
      console.error("Failed to export customer profile:", exportError);
      showErrorToast("Failed to export customer profile.");
    } finally {
      setExportingProfile(false);
    }
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="customers" />

        <main className="main">
          <AdminTopbar showHamburger>
            <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
              <img
                src={notifBell}
                alt="Notifications"
                className="notification-icon"
              />
              <span className="notification-dot" />
            </Link>
            <button
              className="btn primary export-profile-btn"
              type="button"
              disabled={!viewModel || exportingProfile}
              onClick={handleExportProfile}
            >
              <img
                src={downloadIcon}
                alt="Export profile"
                className="export-profile-icon"
              />
              {exportingProfile ? "Exporting..." : "Export Profile"}
            </button>
          </AdminTopbar>

          <div className="breadcrumb">
            <Link to="/customers" className="breadcrumb-link">
              Customers
            </Link>
            <span className="separator">›</span>
            <span className="current">{viewModel?.name || "Customer Details"}</span>
          </div>

          {viewModel ? (
            <div className="details-layout">
              <aside className="profile-card">
                <div className="profile-header">
                  <img
                    src={viewModel.avatar}
                    alt={viewModel.name}
                    className="profile-large-avatar"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackAvatar;
                    }}
                  />
                  <h2>{viewModel.name}</h2>
                  {viewModel.email.includes("@") ? (
                    <a href={`mailto:${viewModel.email}`} className="profile-email">
                      {viewModel.email}
                    </a>
                  ) : (
                    <span className="profile-email">{viewModel.email}</span>
                  )}
                  <p className="join-date">Joined: {viewModel.joinedAt}</p>
                  <div className="profile-status">
                    <span className={`status-pill ${viewModel.statusClass}`}>
                      ● {viewModel.statusLabel}
                    </span>
                  </div>
                </div>

                <hr className="divider" />

                <div className="info-section">
                  <h4>Contact Information</h4>
                  <div className="info-row">
                    <span className="label">Phone No.</span>
                    <span className="value">{viewModel.phone}</span>
                  </div>
                </div>

                <hr className="divider" />

                <div className="info-section">
                  <h4>Business Information</h4>
                  <div className="info-row">
                    <span className="label">Name</span>
                    <span className="value">{viewModel.company}</span>
                  </div>
                </div>

                <hr className="divider" />

                <div className="info-section">
                  <h4>Delivery Address</h4>
                  <p className="address-text multiline-value">{viewModel.address}</p>
                </div>
              </aside>

              <div className="content-area">
                <div className="details-stats-grid">
                  <div className="detail-stat-card">
                    <small>TOTAL SPENT</small>
                    <h3>{viewModel.totalSpent}</h3>
                  </div>
                  <div className="detail-stat-card">
                    <small>TOTAL ORDERS</small>
                    <h3>{viewModel.totalOrders} orders</h3>
                  </div>
                  <div className="detail-stat-card">
                    <small>LAST ORDER DATE</small>
                    <h3>{viewModel.lastOrderDate}</h3>
                  </div>
                </div>

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
                        {loadingOrders ? (
                          <tr>
                            <td colSpan="5" className="table-message">Loading transactions...</td>
                          </tr>
                        ) : mappedOrders.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="table-message">No transactions found.</td>
                          </tr>
                        ) : (
                          mappedOrders.map((order) => (
                            <tr key={order.id || order.orderNumber}>
                              <td className="order-id">{order.orderNumber}</td>
                              <td>
                                <div className="asset-info">
                                  {order.id ? (
                                    <Link
                                      to={`/sales/order-details/${order.id}`}
                                      state={{ order: order.rawOrder }}
                                      style={{ textDecoration: "none", color: "inherit" }}
                                    >
                                      <strong>{order.assetName}</strong>
                                    </Link>
                                  ) : (
                                    <strong>{order.assetName}</strong>
                                  )}
                                  <span className={`mini-badge ${getCategoryBadgeClass(order.category)}`}>
                                    {String(order.category).toUpperCase()}
                                  </span>
                                </div>
                              </td>
                              <td className="date-cell">
                                <div>{order.dateLabel}</div>
                                <small>{order.timeLabel}</small>
                              </td>
                              <td className="amount">{order.amount}</td>
                              <td>
                                <span className={`status-pill ${order.statusClass}`}>
                                  ● {order.statusLabel}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="details-pagination">
                    <span>
                      Showing <strong>{mappedOrders.length > 0 ? (currentPage - 1) * PER_PAGE + 1 : 0}-{Math.min(currentPage * PER_PAGE, totalItems)}</strong> of {totalItems} transactions
                    </span>
                    <div className="nav-controls">
                      <button className="nav-btn" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        ‹
                      </button>
                      <button className="nav-btn active">{currentPage}</button>
                      <button className="nav-btn" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : loadingCustomer ? (
            <div className="details-message-card">Loading customer details...</div>
          ) : error ? (
            <div className="details-message-card details-message-error">{error}</div>
          ) : (
            <div className="details-message-card details-message-error">Unable to load customer details.</div>
          )}
        </main>
      </div>
    </>
  );
};

export default AdminCustomerDetails;
