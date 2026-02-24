import React, { useEffect, useMemo, useState } from "react";
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
import { showSuccessToast } from "../../utils/toast";


const voucherStats = [
  {
    label: "TOTAL VOUCHER",
    value: 100,
    tone: "orange",
    icon: TotalVouch,
  },
  {
    label: "TOTAL ACTIVE",
    value: 112,
    tone: "green",
    icon: ActiveVouch,

  },
  {
    label: "TOTAL USED",
    value: 170,
    tone: "blue",
    icon: UsedVouch,

  },
];

const initialVouchers = [
  {
    name: "Valid on all UI Kits",
    updated: "Updated 2 days ago",
    code: "CERT50UIKIT",
    discount: "$50.00 OFF",
    activeFrom: "Mar 5, 2026",
    activeTo: "Apr 5, 2026",
    usageLimit: 10,
    status: "ACTIVE",
    statusTone: "active",
  },
  {
    name: "Mobile App Templates",
    updated: "19/02/26",
    code: "MOBAPP20OFF",
    discount: "20% OFF",
    activeFrom: "Feb 15, 2026",
    activeTo: "Feb 25, 2026",
    usageLimit: 10,
    status: "EXPIRING SOON",
    statusTone: "expiring",
  },
  {
    name: "SaaS Launch Promo",
    updated: "19/02/26",
    code: "LAUNCHSAAS",
    discount: "$100.00 OFF",
    activeFrom: "Feb 5, 2025",
    activeTo: "Mar 5, 2026",
    usageLimit: 5,
    status: "EXPIRING SOON",
    statusTone: "expiring",
  },
  {
    name: "Loyalty Discount",
    updated: "19/02/26",
    code: "LOYALTY15",
    discount: "15% OFF",
    activeFrom: "Dec 5, 2025",
    activeTo: "Dec 5, 2026",
    usageLimit: 8,
    status: "USED",
    statusTone: "used",
  },
  {
    name: "First time User Promo",
    updated: "19/02/26",
    code: "FIRSTTIME20",
    discount: "20% OFF",
    activeFrom: "Dec 15, 2025",
    activeTo: "Dec 31, 2025",
    usageLimit: 6,
    status: "USED",
    statusTone: "used",
  },
];

const filters = ["All Coupon", "Active", "Expiring Soon", "Used"];

const filterIcons = {
  Active: ActiveFilter,
  "Expiring Soon": Expiring,
  Used,
};

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState(initialVouchers);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All Coupon");
  const [editingCode, setEditingCode] = useState(null);
  const [removingCode, setRemovingCode] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    code: "",
    discount: "",
    activeFrom: "",
    activeTo: "",
    usageLimit: 0,
    status: "ACTIVE",
  });

  const mapStatusToTone = (status) => {
    if (status === "ACTIVE") return "active";
    if (status === "EXPIRING SOON") return "expiring";
    return "used";
  };

  useEffect(() => {
    const incomingVoucher = location.state?.newVoucher;
    if (!incomingVoucher) return;

    setVouchers((prev) => {
      const exists = prev.some((item) => item.code === incomingVoucher.code);
      if (exists) return prev;
      return [
        {
          ...incomingVoucher,
          updated: "Updated just now",
          statusTone: mapStatusToTone(incomingVoucher.status),
        },
        ...prev,
      ];
    });

    navigate("/vouchers", { replace: true });
  }, [location.state, navigate]);

  const totalVoucherCount = vouchers.length;
  const totalActiveCount = useMemo(
    () => vouchers.filter((item) => item.statusTone === "active").length,
    [vouchers],
  );
  const totalUsedCount = useMemo(
    () => vouchers.filter((item) => item.statusTone === "used").length,
    [vouchers],
  );

  const stats = [
    { ...voucherStats[0], value: totalVoucherCount },
    { ...voucherStats[1], value: totalActiveCount },
    { ...voucherStats[2], value: totalUsedCount },
  ];

  const filteredVouchers = useMemo(() => {
    if (selectedFilter === "All Coupon") return vouchers;
    if (selectedFilter === "Active") {
      return vouchers.filter((item) => item.statusTone === "active");
    }
    if (selectedFilter === "Expiring Soon") {
      return vouchers.filter((item) => item.statusTone === "expiring");
    }
    if (selectedFilter === "Used") {
      return vouchers.filter((item) => item.statusTone === "used");
    }
    return vouchers;
  }, [selectedFilter, vouchers]);

  const handleEdit = (voucher) => {
    setEditingCode(voucher.code);
    setEditForm({
      name: voucher.name,
      code: voucher.code,
      discount: voucher.discount,
      activeFrom: voucher.activeFrom,
      activeTo: voucher.activeTo,
      usageLimit: voucher.usageLimit,
      status: voucher.status,
    });
  };

  const closeEditModal = () => {
    setEditingCode(null);
  };

  const handleEditInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    if (!editingCode) return;

    setVouchers((prev) =>
      prev.map((item) =>
        item.code === editingCode
          ? {
              ...item,
              ...editForm,
              usageLimit: Number(editForm.usageLimit) || 0,
              statusTone: mapStatusToTone(editForm.status),
              updated: "Updated just now",
            }
          : item,
      ),
    );

    showSuccessToast("Voucher updated.");
    closeEditModal();
  };

  const openRemoveModal = (voucherCode) => {
    setRemovingCode(voucherCode);
  };

  const closeRemoveModal = () => {
    setRemovingCode(null);
  };

  const confirmRemove = () => {
    if (!removingCode) return;
    setVouchers((prev) => prev.filter((item) => item.code !== removingCode));
    setRemovingCode(null);
    showSuccessToast("Voucher removed.");
  };

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
              <img src={notifBell} alt="Notifications" className="notification-icon" />
              <span className="notification-dot" />
            </Link>
            <Link
              to="/vouchers/new"
              state={{ existingCodes: vouchers.map((item) => item.code) }}
              className="btn primary vouchers-add-btn"
            >
              <span className="vouchers-add-plus" aria-hidden="true">
                +
              </span>
              Add New Coupon
            </Link>
          </AdminTopbar>

          <div className="page-header">
            <h2>Voucher Management</h2>
            <p className="subtitle">
              Manage and control all discount vouchers in the CertiCode system.
            </p>
          </div>

          <section className="vouchers-stats-grid">
            {stats.map((item) => (
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
                  <h3>{item.value}</h3>
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
                    onClick={() => setSelectedFilter(filter)}
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
                <img src={FilterVouch} alt="" aria-hidden="true" className="vouchers-filter-icon" />
                More Filters
              </button>
            </div>

            <div className="vouchers-table-wrap">
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
                  {filteredVouchers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="voucher-empty-cell">
                        No vouchers found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredVouchers.map((voucher) => (
                      <tr key={voucher.code}>
                        <td className="voucher-name-cell">
                          <strong>{voucher.name}</strong>
                          <span>{voucher.updated}</span>
                        </td>
                        <td>
                          <span className="voucher-code">{voucher.code}</span>
                        </td>
                        <td>
                          <span className="voucher-discount">{voucher.discount}</span>
                        </td>
                        <td>{voucher.activeFrom}</td>
                        <td>{voucher.activeTo}</td>
                        <td className="voucher-usage-limit">{voucher.usageLimit}</td>
                        <td>
                          <span className={`voucher-status ${voucher.statusTone}`}>
                            {voucher.status}
                          </span>
                        </td>
                        <td>
                          <div className="voucher-actions">
                            <button
                              type="button"
                              aria-label={`Edit ${voucher.name}`}
                              onClick={() => handleEdit(voucher)}
                            >
                              <img src={VouchEdit} alt="" aria-hidden="true" className="voucher-action-icon" />
                            </button>
                            <button
                              type="button"
                              aria-label={`Remove ${voucher.name}`}
                              onClick={() => openRemoveModal(voucher.code)}
                            >
                              <img src={VouchRemove} alt="" aria-hidden="true" className="voucher-action-icon" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="vouchers-pagination">
              <span>
                Showing{" "}
                <strong>
                  {filteredVouchers.length === 0 ? "0-0" : `1-${filteredVouchers.length}`}
                </strong>{" "}
                of {filteredVouchers.length} vouchers
              </span>
              <div className="vouchers-pagination-controls">
                <button type="button" className="voucher-page-nav-btn" aria-label="Previous page">
                  <img src={PaginationLeft} alt="" aria-hidden="true" className="voucher-page-nav-icon" />
                </button>
                <button type="button" className="active">
                  1
                </button>
                <button type="button">2</button>
                <button type="button" className="voucher-page-nav-btn" aria-label="Next page">
                  <img src={PaginationRight} alt="" aria-hidden="true" className="voucher-page-nav-icon" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {editingCode && (
        <div className="voucher-edit-overlay" onClick={closeEditModal}>
          <div
            className="voucher-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Edit Voucher</h3>

            <div className="voucher-edit-grid">
              <label>
                Name
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleEditInputChange("name", e.target.value)}
                />
              </label>

              <label>
                Code
                <input
                  type="text"
                  value={editForm.code}
                  onChange={(e) => handleEditInputChange("code", e.target.value.toUpperCase())}
                />
              </label>

              <label>
                Discount
                <input
                  type="text"
                  value={editForm.discount}
                  onChange={(e) => handleEditInputChange("discount", e.target.value)}
                />
              </label>

              <label>
                Usage Limit
                <input
                  type="number"
                  min="0"
                  value={editForm.usageLimit}
                  onChange={(e) => handleEditInputChange("usageLimit", e.target.value)}
                />
              </label>

              <label>
                Active From
                <input
                  type="text"
                  value={editForm.activeFrom}
                  onChange={(e) => handleEditInputChange("activeFrom", e.target.value)}
                />
              </label>

              <label>
                Active To
                <input
                  type="text"
                  value={editForm.activeTo}
                  onChange={(e) => handleEditInputChange("activeTo", e.target.value)}
                />
              </label>

              <label className="voucher-edit-status">
                Status
                <select
                  value={editForm.status}
                  onChange={(e) => handleEditInputChange("status", e.target.value)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="EXPIRING SOON">EXPIRING SOON</option>
                  <option value="USED">USED</option>
                </select>
              </label>
            </div>

            <div className="voucher-edit-actions">
              <button type="button" onClick={closeEditModal}>
                Cancel
              </button>
              <button type="button" className="save" onClick={handleSaveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {removingCode && (
        <div className="voucher-remove-overlay" onClick={closeRemoveModal}>
          <div
            className="voucher-remove-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>Remove Voucher</h3>
            <p>
              Are you sure you want to remove this voucher?
              <br />
            </p>
            <div className="voucher-remove-actions">
              <button type="button" className="cancel" onClick={closeRemoveModal}>
                Cancel
              </button>
              <button type="button" className="remove" onClick={confirmRemove}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminVouchers;
