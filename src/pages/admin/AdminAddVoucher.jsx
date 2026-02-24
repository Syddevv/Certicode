import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminAddVoucher.css";
import notifBell from "../../assets/NotifBell.png";
import GenDetails from "../../assets/GenDetails.png";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });    
};

const buildDiscount = (type, value) => {
  const amount = Number(value) || 0;
  if (type === "percent") return `${amount}% OFF`;
  return `$${amount.toFixed(2)} OFF`;
};

const AdminAddVoucher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productOptions = [
    { id: "saas-template", title: "E-commerce SaaS Template", meta: "Saas Template", version: "v2.4.1" },
    { id: "portfolio-website", title: "Developer Portfolio Website", meta: "Website Template", version: "v2.4.1" },
    { id: "uiux-kit", title: "UI/UX Kit", meta: "UI/UX Design", version: "v2.4.1" },
    { id: "foodie-app", title: "Foodie App", meta: "Website App", version: "v2.4.1" },
    { id: "mobile-finance", title: "Mobile Finance App", meta: "Mobile App", version: "v2.4.1" },
    { id: "analytics-web", title: "Analytics Dashboard", meta: "Web App", version: "v2.4.1" },
  ];
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(productOptions.slice(0, 4));
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    discountType: "fixed",
    discountValue: "",
    minPurchaseAmount: "",
    maxDiscount: "",
    availableFrom: "",
    availableTo: "",
    usageLimit: "",
    status: "ACTIVE",
    applicableTo: "Specific Product",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
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

    setLoading(true);

    const voucherPayload = {
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      discount: buildDiscount(formData.discountType, formData.discountValue),
      activeFrom: formatDate(formData.availableFrom),
      activeTo: formatDate(formData.availableTo),
      usageLimit: Number(formData.usageLimit) || 0,
      status: formData.status,
      applicableTo: formData.applicableTo,
      selectedProducts: selectedProducts.map((item) => item.title),
    };

    const existingCodes = location.state?.existingCodes || [];
    const duplicate = existingCodes.includes(voucherPayload.code);

    if (duplicate) {
      setLoading(false);
      showErrorToast("Voucher code already exists.");
      return;
    }

    setLoading(false);
    showSuccessToast("Voucher created successfully.");
    navigate("/vouchers", { state: { newVoucher: voucherPayload } });
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddMoreProduct = () => {
    const selectedIds = new Set(selectedProducts.map((item) => item.id));
    const nextItem = productOptions.find((item) => !selectedIds.has(item.id));
    if (!nextItem) return;
    setSelectedProducts((prev) => [...prev, nextItem]);
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
          <Link to="/add-asset" className="btn primary">
            + Add New Asset
          </Link>
        </AdminTopbar>

        <section className="add-voucher-header">
          <nav className="add-voucher-breadcrumbs">
            <Link to="/vouchers" className="crumb-link">
              Vouchers
            </Link>
            <span className="separator">›</span>
            <span className="current">Add New Voucher</span>
          </nav>
          <h1>Create New Voucher</h1>
          <p className="subtitle">
            Populate the details below to list a new voucher in the repository.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="add-voucher-form">
          <section className="add-voucher-card">
            <header className="add-voucher-card-header">
              <img src={GenDetails} alt="" aria-hidden="true" className="add-voucher-header-icon" />
              <h2>General Details</h2>
            </header>

            <div className="add-voucher-grid">
              <label>
                Voucher Name
                <input
                  type="text"
                  name="name"
                  placeholder="e.g First time user voucher"
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
                  placeholder="e.g FIRSTTIME20"
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
                  <option value="percent">Percentage</option>
                </select>
              </label>

              <label>
                Discount Value
                <input
                  type="number"
                  name="discountValue"
                  placeholder="e.g 50"
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
                  placeholder="e.g 50.00"
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
                  placeholder="e.g 50.00"
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
                  placeholder="e.g 10"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </label>

              <label>
                Status
                <span className="add-voucher-status-pill active">
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
                    onClick={handleAddMoreProduct}
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
                Saved as Draft
              </button>
              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? "Creating..." : "Create Voucher"}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default AdminAddVoucher;
