import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import MultiProductSelector from "../../components/MultiProductSelector";
import "../../styles/adminAddVoucher.css";
import notifBell from "../../assets/NotifBell.png";
import voucherGenDetails from "../../assets/voucherGenDetails.png";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const PRODUCT_OPTIONS = [
  {
    id: "saas-template",
    title: "E-commerce SaaS Template",
    meta: "Saas Template",
    version: "v2.4.1",
  },
  {
    id: "portfolio-website",
    title: "Developer Portfolio Website",
    meta: "Website Template",
    version: "v2.4.1",
  },
  { id: "uiux-kit", title: "UI/UX Kit", meta: "UI/UX Design", version: "v2.4.1" },
  { id: "foodie-app", title: "Foodie App", meta: "Website App", version: "v2.4.1" },
  {
    id: "mobile-finance",
    title: "Mobile Finance App",
    meta: "Mobile App",
    version: "v2.4.1",
  },
  {
    id: "analytics-web",
    title: "Analytics Dashboard",
    meta: "Web App",
    version: "v2.4.1",
  },
];

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const parseDiscount = (discount = "") => {
  const clean = String(discount).trim();
  if (!clean) return { discountType: "fixed", discountValue: "" };
  if (clean.includes("%")) {
    return {
      discountType: "percent",
      discountValue: clean.replace(/[^\d.]/g, ""),
    };
  }

  return {
    discountType: "fixed",
    discountValue: clean.replace(/[^\d.]/g, ""),
  };
};

const buildDiscount = (type, value) => {
  const amount = Number(value) || 0;
  if (type === "percent") return `${amount}% OFF`;
  return `$${amount.toFixed(2)} OFF`;
};

const AdminEditVoucher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const voucher = location.state?.voucher;
  const existingCodes = location.state?.existingCodes || [];

  const discountDefaults = useMemo(
    () => parseDiscount(voucher?.discount),
    [voucher?.discount],
  );

  const [loading, setLoading] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(PRODUCT_OPTIONS.slice(0, 4));
  const [formData, setFormData] = useState({
    name: voucher?.name || "Valid on all UI Kits",
    code: voucher?.code || "CERT50UIKIT",
    discountType: discountDefaults.discountType,
    discountValue: discountDefaults.discountValue || "50",
    minPurchaseAmount: "",
    maxDiscount: "",
    availableFrom: toDateInputValue(voucher?.activeFrom) || "2026-03-05",
    availableTo: toDateInputValue(voucher?.activeTo) || "2026-04-05",
    usageLimit: String(voucher?.usageLimit ?? 10),
    status: voucher?.status || "ACTIVE",
    applicableTo: "Specific Product",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSaveChanges = (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.code ||
      !formData.discountValue ||
      !formData.availableFrom ||
      !formData.availableTo ||
      !formData.usageLimit
    ) {
      showErrorToast("Please fill in all required voucher fields.");
      return;
    }

    const updatedCode = formData.code.trim().toUpperCase();
    const duplicate = existingCodes.some(
      (code) => code !== voucher?.code && code === updatedCode,
    );

    if (duplicate) {
      showErrorToast("Voucher code already exists.");
      return;
    }

    setLoading(true);

    const updatedVoucher = {
      name: formData.name.trim(),
      code: updatedCode,
      discount: buildDiscount(formData.discountType, formData.discountValue),
      activeFrom: formatDate(formData.availableFrom),
      activeTo: formatDate(formData.availableTo),
      usageLimit: Number(formData.usageLimit) || 0,
      status: formData.status,
      selectedProducts: selectedProducts.map((item) => item.title),
    };

    showSuccessToast("Voucher updated.");
    navigate("/vouchers", { state: { updatedVoucher, previousCode: voucher?.code } });
  };

  return (
    <div className="layout">
      <Sidebar activePage="vouchers" />

      <main className="add-voucher-main">
        <AdminTopbar showHamburger>
          <Link
            to="/admin-notification"
            className="notification-link"
            aria-label="Notifications"
          >
            <img src={notifBell} alt="Notifications" className="notification-icon" />
            <span className="notification-dot" />
          </Link>
        </AdminTopbar>

        <section className="add-voucher-header">
          <nav className="add-voucher-breadcrumbs">
            <Link to="/vouchers" className="crumb-link">
              Vouchers
            </Link>
            <span className="separator">›</span>
            <span className="current">Edit Voucher</span>
          </nav>
          <h1>Edit Voucher</h1>
          <p className="subtitle">
            Update the selected voucher&apos;s information by modifying its details,
            validity, and discount settings as needed.
          </p>
        </section>

        <form onSubmit={handleSaveChanges} className="add-voucher-form">
          <section className="add-voucher-card">
            <header className="add-voucher-card-header">
              <img
                src={voucherGenDetails}
                alt=""
                aria-hidden="true"
                className="add-voucher-header-icon"
              />
              <h2>General Details</h2>
            </header>

            <div className="add-voucher-grid">
              <label>
                Voucher Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Voucher Code
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Discount Type
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percent">Percentage (%)</option>
                </select>
              </label>

              <label>
                Discount Value
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </label>

              <label>
                Minimum Purchase Amount
                <input
                  type="number"
                  name="minPurchaseAmount"
                  value={formData.minPurchaseAmount}
                  onChange={handleInputChange}
                  min="0"
                />
              </label>

              <label>
                Maximum Discount (for % type)
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleInputChange}
                  min="0"
                />
              </label>

              <label>
                Available from
                <input
                  type="date"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Available to
                <input
                  type="date"
                  name="availableTo"
                  value={formData.availableTo}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Usage Limit
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </label>

              <label>
                Status
                <span
                  className={`add-voucher-status-pill ${String(formData.status).toLowerCase() === "active" ? "active" : ""}`}
                >
                  <span className="dot">•</span> {formData.status}
                </span>
              </label>

              <label className="full-width">
                Applicable to
                <select
                  name="applicableTo"
                  value={formData.applicableTo}
                  onChange={handleInputChange}
                >
                  <option value="Specific Product">Specific Product</option>
                  <option value="All Products">All Products</option>
                </select>
              </label>

              {formData.applicableTo === "Specific Product" && (
                <div className="full-width voucher-products-section">
                  <h3>Select (Select Multiple)</h3>

                  <div className="voucher-products-grid">
                    {selectedProducts.map((product) => (
                      <article key={product.id} className="voucher-product-card">
                        <div className="voucher-product-thumb" aria-hidden="true" />
                        <div className="voucher-product-info">
                          <strong>{product.title}</strong>
                          <span>
                            {product.meta} • {product.version}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="voucher-product-remove"
                          aria-label={`Remove ${product.title}`}
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          ×
                        </button>
                      </article>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="voucher-add-more"
                    onClick={() => setIsProductSelectorOpen(true)}
                  >
                    + Add More
                  </button>
                </div>
              )}
            </div>
          </section>

          <footer className="add-voucher-footer">
            <span>All changes saved locally</span>
            <div className="add-voucher-footer-actions">
              <button
                type="button"
                className="btn secondary"
                onClick={() => navigate("/vouchers")}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </footer>
        </form>
      </main>

      {isProductSelectorOpen && (
        <MultiProductSelector
          onClose={() => setIsProductSelectorOpen(false)}
          onSelect={() => setIsProductSelectorOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminEditVoucher;
