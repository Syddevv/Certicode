import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/ViewVoucher.css";
import notifBell from "../../assets/NotifBell.png";
import { IconDiscountFilled } from "@tabler/icons-react";
const products = [
  {
    id: 1,
    name: "E-commerce SaaS Template",
    type: "Saas Template",
    version: "v2.4.1",
  },
  {
    id: 2,
    name: "Developer Portfolio Website",
    type: "Website Template",
    version: "v2.4.1",
  },
  {
    id: 3,
    name: "UI/UX Kit",
    type: "UI/UX Design",
    version: "v2.4.1",
  },
  {
    id: 4,
    name: "Foodie App",
    type: "Website App",
    version: "v2.4.1",
  },
];

const voucher = {
  voucherName: "Valid on all UI Kits",
  voucherCode: "CERT5OUIKIT",
  discountType: "Percentage (%)",
  discountValue: "50",
  minimumPurchaseAmount: "50",
  maximumDiscount: "100",
  availableFrom: "March 5, 2026",
  availableTo: "April 5, 2026",
  usageLimit: "10",
  status: "ACTIVE",
  applicableTo: "Specific Product",
};

function Field({ label, value, mono = false, center = false }) {
  return (
    <div className="voucher-field">
      <label>{label}</label>
      <span
        className={`field-value${mono ? " mono" : ""}${center ? " center-val" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function ViewVoucher() {
  const handleSearch = (term) => {};

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="inventory" />

        <main className="main view-voucher-wrapper">
          <AdminTopbar showHamburger onSearch={handleSearch}>
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
          </AdminTopbar>

          {/* Breadcrumb */}
          <nav className="view-voucher-breadcrumb">
            <Link to="/inventory">Inventory</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">View Voucher Details</span>
          </nav>

          {/* Page Header */}
          <div className="view-voucher-header">
            <div>
              <h2>View Voucher Details</h2>
              <p className="header-subtitle">
                The information below displays the complete details of the
                selected voucher for viewing purposes only.
              </p>
            </div>
            <button className="btn-edit-content">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.333 2a1.886 1.886 0 0 1 2.667 2.667L5.333 13.333 2 14l.667-3.333L11.333 2z"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Edit Content
            </button>
          </div>

          {/* Voucher Card */}
          <div className="voucher-card">
            {/* Card Title */}
            <div className="voucher-card-title">
              <span className="title-icon">
                <IconDiscountFilled color="#F97316" />
              </span>
              <span className="title-text">Voucher Details</span>
            </div>

            <hr className="voucher-divider" />

            {/* Row 1 */}
            <div className="voucher-fields-row">
              <Field label="Voucher Name" value={voucher.voucherName} />
              <Field label="Voucher Code" value={voucher.voucherCode} mono />
              <Field
                label="Discount Type"
                value={voucher.discountType}
                center
              />
              <Field
                label="Discount Value"
                value={voucher.discountValue}
                center
              />
            </div>

            {/* Row 2 */}
            <div className="voucher-fields-row">
              <Field
                label="Minimum Purchase Amount"
                value={voucher.minimumPurchaseAmount}
              />
              <Field
                label="Maximum Discount (for % type)"
                value={voucher.maximumDiscount}
              />
              <Field label="Available from" value={voucher.availableFrom} />
              <Field label="Available to" value={voucher.availableTo} />
            </div>

            {/* Row 3 */}
            <div className="voucher-fields-row">
              <Field label="Usage Limit" value={voucher.usageLimit} />

              <div className="voucher-field">
                <label>Status</label>
                <span className="status-active">
                  <span className="status-dot" />
                  {voucher.status}
                </span>
              </div>

              <div className="voucher-field">
                <label>Applicable to:</label>
                <span className="field-value">{voucher.applicableTo}</span>
              </div>
            </div>

            {/* Products */}
            <div className="products-section">
              <p className="products-label">Select (Select Multiple)</p>
              <div className="products-grid">
                {products.map((product) => (
                  <div className="product-item" key={product.id}>
                    <div className="product-thumbnail" />
                    <div className="product-info">
                      <span className="product-name">{product.name}</span>
                      <span className="product-meta">
                        {product.type} • {product.version}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
