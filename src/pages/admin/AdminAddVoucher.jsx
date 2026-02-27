import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import MultiProductSelector from "../../components/MultiProductSelector";
import "../../styles/adminAddVoucher.css";
import notifBell from "../../assets/NotifBell.png";
import GenDetails from "../../assets/GenDetails.png";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { AdminPromoAPI } from "../../services/AdminPromoAPI";
import { AdminInventoryAPI } from "../../services/AdminInventoryAPI";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

const normalizeProductOption = (product, index = 0) => ({
  id: product?.id ?? product?.product_id ?? product?.asset_id ?? `product-${index + 1}`,
  title: product?.title ?? product?.name ?? `Product ${index + 1}`,
  category:
    product?.category ??
    product?.asset_type ??
    product?.type ??
    product?.meta ??
    "Uncategorized",
  version: product?.version ?? product?.updated_ago ?? "N/A",
  featured_image: product?.featured_image ?? null,
});

const dedupeProducts = (products) => {
  const seen = new Set();
  return products.filter((product) => {
    const key = String(product.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const parsePossibleIds = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object" ? item?.id ?? item?.product_id ?? item?.asset_id : item,
      )
      .filter((item) => item !== undefined && item !== null && item !== "");
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return parsePossibleIds(parsed);
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

const extractVoucherProducts = (voucher) => {
  const candidates = [
    voucher?.products,
    voucher?.applicable_products,
    voucher?.applicableProducts,
    voucher?.selected_products,
  ];

  const list = candidates.find((candidate) => Array.isArray(candidate)) || [];
  return dedupeProducts(list.map((product, index) => normalizeProductOption(product, index)));
};

const extractVoucherProductIds = (voucher) => {
  const candidates = [
    voucher?.product_ids,
    voucher?.applicable_product_ids,
    voucher?.products,
    voucher?.applicable_products,
    voucher?.selected_products,
  ];

  const ids = candidates.flatMap((candidate) => parsePossibleIds(candidate));
  return Array.from(new Set(ids.map((id) => String(id))));
};

const resolveApplicableTo = (voucher, hasSpecificProducts) => {
  const value = String(
    voucher?.applicable_to ?? voucher?.applies_to ?? voucher?.scope ?? "",
  )
    .trim()
    .toLowerCase();

  if (["specific", "specific_product", "specific_products", "product", "products"].includes(value)) {
    return "specific_product";
  }
  if (["all", "all_products", "global"].includes(value)) {
    return "all_products";
  }

  return hasSpecificProducts ? "specific_product" : "all_products";
};

const AdminAddVoucher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.voucher ? true : false;
  const existingVoucher = location.state?.voucher || null;
  
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [initialProductIds, setInitialProductIds] = useState([]);
  const [didHydrateExistingProducts, setDidHydrateExistingProducts] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    value: "",
    min_order_amount: "",
    max_uses: "",
    valid_from: "",
    valid_until: "",
    is_active: true,
    applicable_to: "specific_product",
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAvailableProducts = async () => {
      setProductsLoading(true);
      try {
        const products = [];
        let page = 1;
        let totalPages = 1;

        do {
          const response = await AdminInventoryAPI.getProducts(page, {
            status: "active",
          });
          const pageProducts = response?.products || response?.data || [];
          products.push(...pageProducts);
          totalPages = response?.pagination?.total_pages || response?.pagination?.last_page || 1;
          page += 1;
        } while (page <= totalPages && page <= 100);

        if (!isMounted) return;

        const normalizedProducts = dedupeProducts(
          products.map((product, index) => normalizeProductOption(product, index)),
        );
        setAvailableProducts(normalizedProducts);
      } catch (error) {
        console.error("Error fetching products for voucher:", error);
        if (isMounted) {
          setAvailableProducts([]);
          showErrorToast("Failed to load products.");
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    };

    fetchAvailableProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (existingVoucher) {
      const explicitProducts = extractVoucherProducts(existingVoucher);
      const voucherProductIds = extractVoucherProductIds(existingVoucher);
      const hasSpecificProducts =
        explicitProducts.length > 0 || voucherProductIds.length > 0;

      setFormData({
        code: existingVoucher.code || "",
        description: existingVoucher.description || "",
        type: existingVoucher.type || "percentage",
        value: existingVoucher.value || "",
        min_order_amount: existingVoucher.min_order_amount || "",
        max_uses: existingVoucher.max_uses || "",
        valid_from: formatDateForInput(existingVoucher.valid_from),
        valid_until: formatDateForInput(existingVoucher.valid_until),
        is_active: existingVoucher.is_active !== undefined ? existingVoucher.is_active : true,
        applicable_to: resolveApplicableTo(existingVoucher, hasSpecificProducts),
      });

      setSelectedProducts(explicitProducts);
      setInitialProductIds(voucherProductIds);
      setDidHydrateExistingProducts(explicitProducts.length > 0 || voucherProductIds.length === 0);
    }
  }, [existingVoucher]);

  useEffect(() => {
    if (!existingVoucher || didHydrateExistingProducts) return;
    if (!availableProducts.length) return;

    const mappedProducts = availableProducts.filter((product) =>
      initialProductIds.includes(String(product.id)),
    );

    setSelectedProducts(mappedProducts);
    setDidHydrateExistingProducts(true);
  }, [
    availableProducts,
    didHydrateExistingProducts,
    existingVoucher,
    initialProductIds,
  ]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleRemoveProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => String(product.id) !== String(id)),
    );
  };

  const handleProductSelect = (products) => {
    const normalizedProducts = dedupeProducts(
      products.map((product, index) => normalizeProductOption(product, index)),
    );
    setSelectedProducts(normalizedProducts);
    setIsProductSelectorOpen(false);
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

    if (formData.applicable_to === "specific_product" && selectedProducts.length === 0) {
      showErrorToast("Please select at least one applicable product.");
      return;
    }

    setLoading(true);

    try {
      const selectedProductIds = selectedProducts
        .map((product) => product.id)
        .filter((id) => id !== undefined && id !== null && id !== "")
        .map((id) => {
          const numericId = Number(id);
          return Number.isNaN(numericId) ? id : numericId;
        });

      const specificScope = formData.applicable_to === "specific_product";
      const scopeValue = specificScope ? "specific" : "all";
      const appliesToValue = specificScope ? "specific_product" : "all_products";
      const productsAsObjects = selectedProductIds.map((id) => ({ id }));

      const submitData = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description || null,
        type: formData.type,
        value: parseFloat(formData.value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        valid_from: formData.valid_from || null,
        valid_until: formData.valid_until || null,
        is_active: formData.is_active,
        applicable_to: appliesToValue,
        applies_to: appliesToValue,
        apply_to: scopeValue,
        scope: scopeValue,
        applies_to_all: !specificScope,
        all_products: !specificScope,
        is_all_products: !specificScope,
        is_specific_product: specificScope,
        product_id:
          specificScope && selectedProductIds.length === 1
            ? selectedProductIds[0]
            : null,
        is_global: !specificScope,
        product_ids:
          specificScope ? selectedProductIds : [],
        applicable_product_ids: specificScope ? selectedProductIds : [],
        selected_product_ids: specificScope ? selectedProductIds : [],
        applicable_products: specificScope ? productsAsObjects : [],
        products: specificScope ? productsAsObjects : [],
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

              <label className="full-width">
                Applicable to
                <select
                  name="applicable_to"
                  value={formData.applicable_to}
                  onChange={handleInputChange}
                >
                  <option value="specific_product">Specific Product</option>
                  <option value="all_products">All Products</option>
                </select>
              </label>

              {formData.applicable_to === "specific_product" && (
                <div className="full-width voucher-products-section">
                  <h3>Select (Select Multiple)</h3>

                  {productsLoading && (
                    <p className="voucher-products-state">Loading products...</p>
                  )}

                  {!productsLoading && selectedProducts.length === 0 && (
                    <p className="voucher-products-state">No products selected yet.</p>
                  )}

                  {selectedProducts.length > 0 && (
                    <div className="voucher-products-grid">
                      {selectedProducts.map((product) => (
                        <article key={product.id} className="voucher-product-card">
                          <div className="voucher-product-thumb" aria-hidden="true">
                            {product.featured_image && (
                              <img src={product.featured_image} alt="" aria-hidden="true" />
                            )}
                          </div>
                          <div className="voucher-product-info">
                            <strong>{product.title}</strong>
                            <span>
                              {product.category} • {product.version}
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
                  )}

                  <button
                    type="button"
                    className="voucher-add-more"
                    onClick={() => setIsProductSelectorOpen(true)}
                    disabled={productsLoading || availableProducts.length === 0}
                  >
                    + Add More
                  </button>
                  {!productsLoading && availableProducts.length === 0 && (
                    <small className="field-hint">No products available in inventory.</small>
                  )}
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
                {loading ? "Saving..." : (isEditing ? "Update Voucher" : "Create Voucher")}
              </button>
            </div>
          </footer>
        </form>
      </main>

      {isProductSelectorOpen && (
        <MultiProductSelector
          onClose={() => setIsProductSelectorOpen(false)}
          onSelect={handleProductSelect}
          products={availableProducts}
          selectedIds={selectedProducts.map((product) => product.id)}
          loading={productsLoading}
        />
      )}
    </div>
  );
};

export default AdminAddVoucher;
