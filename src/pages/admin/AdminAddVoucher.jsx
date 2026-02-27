import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminAddVoucher.css";
import notifBell from "../../assets/NotifBell.png";
import GenDetails from "../../assets/GenDetails.png";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { AdminPromoAPI } from "../../services/AdminPromoAPI";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

const AdminAddVoucher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.voucher ? true : false;
  const existingVoucher = location.state?.voucher || null;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    min_order_amount: "",
    max_uses: "",
    valid_from: "",
    valid_until: "",
    is_active: true
  });

  useEffect(() => {
    if (existingVoucher) {
      setFormData({
        code: existingVoucher.code || "",
        description: existingVoucher.description || "",
        type: existingVoucher.type || "percentage",
        value: existingVoucher.value || "",
        min_order_amount: existingVoucher.min_order_amount || "",
        max_uses: existingVoucher.max_uses || "",
        valid_from: formatDateForInput(existingVoucher.valid_from),
        valid_until: formatDateForInput(existingVoucher.valid_until),
        is_active: existingVoucher.is_active !== undefined ? existingVoucher.is_active : true
      });
    }
  }, [existingVoucher]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.code || !formData.value) {
      showErrorToast("Please fill in all required voucher fields.");
      return;
    }

    if (formData.type === 'percentage' && parseFloat(formData.value) > 100) {
      showErrorToast("Percentage discount cannot exceed 100%.");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description || null,
        type: formData.type,
        value: parseFloat(formData.value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active
      };

      if (isEditing && existingVoucher) {
        await AdminPromoAPI.updateVoucher(existingVoucher.id, submitData);
        showSuccessToast("Voucher updated successfully.");
      } else {
        await AdminPromoAPI.createVoucher(submitData);
        showSuccessToast("Voucher created successfully.");
      }
      
      navigate("/vouchers");
    } catch (error) {
      showErrorToast(error.message || `Failed to ${isEditing ? 'update' : 'create'} voucher`);
    } finally {
      setLoading(false);
    }
  };

  const getDiscountPlaceholder = () => {
    if (formData.type === 'percentage') return "e.g 20";
    if (formData.type === 'fixed') return "e.g 50.00";
    return "0";
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
            <Link to="/vouchers" className="crumb-link">Vouchers</Link>
            <span className="separator">›</span>
            <span className="current">{isEditing ? 'Edit Voucher' : 'Add New Voucher'}</span>
          </nav>
          <h1>{isEditing ? 'Edit Voucher' : 'Create New Voucher'}</h1>
          <p className="subtitle">
            {isEditing 
              ? 'Update the voucher details below.' 
              : 'Populate the details below to create a new promo code in the system.'}
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
                Voucher Description
                <input
                  type="text"
                  name="description"
                  placeholder="e.g Get 20% off your order"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Voucher Code <span className="required">*</span>
                <input
                  type="text"
                  name="code"
                  placeholder="e.g SAVE20"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  maxLength="50"
                  disabled={isEditing}
                />
                <small className="field-hint">Will be automatically uppercase</small>
              </label>

              <label>
                Discount Type <span className="required">*</span>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </label>

              <label>
                Discount Value <span className="required">*</span>
                <input
                  type="number"
                  name="value"
                  placeholder={getDiscountPlaceholder()}
                  value={formData.value}
                  onChange={handleInputChange}
                  min="0"
                  max={formData.type === 'percentage' ? 100 : null}
                  step="0.01"
                  required
                />
                {formData.type === 'percentage' && (
                  <small className="field-hint">Maximum 100%</small>
                )}
              </label>

              <label>
                Minimum Order Amount
                <input
                  type="number"
                  name="min_order_amount"
                  placeholder="e.g 50.00"
                  value={formData.min_order_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                />
                <small className="field-hint">Leave empty for no minimum</small>
              </label>

              <label>
                Maximum Uses
                <input
                  type="number"
                  name="max_uses"
                  placeholder="e.g 100"
                  value={formData.max_uses}
                  onChange={handleInputChange}
                  min="1"
                />
                <small className="field-hint">Leave empty for unlimited</small>
              </label>

              <label>
                Valid From
                <input
                  type="datetime-local"
                  name="valid_from"
                  value={formData.valid_from}
                  onChange={handleInputChange}
                />
                <small className="field-hint">Leave empty to start immediately</small>
              </label>

              <label>
                Valid Until
                <input
                  type="datetime-local"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleInputChange}
                />
                <small className="field-hint">Leave empty for no expiry</small>
              </label>

              <label className="full-width checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                />
                <span>Active</span>
              </label>
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
                {loading ? "Saving..." : (isEditing ? "Update Voucher" : "Create Voucher")}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default AdminAddVoucher;