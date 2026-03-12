import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/viewVoucher.css";
import notifBell from "../../assets/NotifBell.png";
import { IconDiscountFilled } from "@tabler/icons-react";
import { AdminPromoAPI } from "../../services/AdminPromoAPI";
import { AdminInventoryAPI } from "../../services/AdminInventoryAPI";
import { showErrorToast } from "../../utils/toast";

const parsePossibleIds = (value) => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) =>
        typeof item === "object"
          ? (item?.id ?? item?.product_id ?? item?.asset_id)
          : item,
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

const getVoucherPayload = (response) =>
  response?.voucher ?? response?.data ?? response?.promo ?? response;

const normalizeProduct = (product, index = 0) => ({
  id:
    product?.id ??
    product?.product_id ??
    product?.asset_id ??
    `product-${index + 1}`,
  title: product?.title ?? product?.name ?? `Product ${index + 1}`,
  category:
    product?.category ??
    product?.asset_type ??
    product?.type ??
    product?.meta ??
    "Uncategorized",
  version: product?.version ?? product?.updated_ago ?? "N/A",
});

const normalizeVoucher = (voucher) => {
  const productsRaw =
    voucher?.products ??
    voucher?.applicable_products ??
    voucher?.applicableProducts ??
    voucher?.selected_products ??
    [];

  const normalizedProducts = Array.isArray(productsRaw)
    ? productsRaw.map((product, index) => normalizeProduct(product, index))
    : [];

  const productIds = Array.from(
    new Set(
      [
        ...parsePossibleIds(voucher?.product_ids),
        ...parsePossibleIds(voucher?.applicable_product_ids),
        ...parsePossibleIds(productsRaw),
      ].map((id) => String(id)),
    ),
  );

  return {
    id: voucher?.id,
    code: voucher?.code || "-",
    description: voucher?.description || null,
    type: voucher?.type || "fixed",
    value: voucher?.value,
    min_order_amount: voucher?.min_order_amount,
    max_discount: voucher?.max_discount ?? voucher?.maximum_discount ?? null,
    valid_from: voucher?.valid_from,
    valid_until: voucher?.valid_until,
    max_uses: voucher?.max_uses,
    used_count: voucher?.used_count ?? 0,
    is_active: voucher?.is_active !== undefined ? voucher.is_active : true,
    applicable_to:
      voucher?.applicable_to ??
      voucher?.applies_to ??
      (productIds.length ? "specific_products" : "all_products"),
    products: normalizedProducts,
    productIds,
  };
};

const formatDate = (value) => {
  if (!value) return "Not set";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Not set";

  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "N/A";
  return `$${numericValue.toFixed(2)}`;
};

const getStatusMeta = (voucher) => {
  const now = new Date();
  const validUntil = voucher.valid_until ? new Date(voucher.valid_until) : null;
  const validFrom = voucher.valid_from ? new Date(voucher.valid_from) : null;

  if (!voucher.is_active) {
    return { label: "INACTIVE", tone: "inactive" };
  }

  if (validFrom && validFrom > now) {
    return { label: "SCHEDULED", tone: "scheduled" };
  }

  if (validUntil && validUntil < now) {
    return { label: "EXPIRED", tone: "expired" };
  }

  if (voucher.max_uses && voucher.used_count >= voucher.max_uses) {
    return { label: "USED UP", tone: "used" };
  }

  if (validUntil) {
    const daysUntilExpiry = Math.ceil(
      (validUntil - now) / (1000 * 60 * 60 * 24),
    );
    if (daysUntilExpiry <= 7) {
      return { label: "EXPIRING SOON", tone: "expiring" };
    }
  }

  return { label: "ACTIVE", tone: "active" };
};

const getDiscountTypeLabel = (type) => {
  if (type === "percentage") return "Percentage (%)";
  if (type === "fixed") return "Fixed Amount ($)";
  return type || "N/A";
};

const getDiscountValueLabel = (type, value) => {
  if (value === null || value === undefined || value === "") return "N/A";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);

  if (type === "percentage") {
    return `${numericValue}%`;
  }

  return `$${numericValue.toFixed(2)}`;
};

const getApplicableToLabel = (value, hasProducts) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (
    [
      "specific",
      "specific_product",
      "specific_products",
      "products",
      "product",
    ].includes(normalized)
  ) {
    return "Specific Product";
  }

  if (["all", "all_products", "global"].includes(normalized)) {
    return "All Products";
  }

  return hasProducts ? "Specific Product" : "All Products";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { id: voucherIdParam } = useParams();
  const incomingVoucher = location.state?.voucher;

  const [voucher, setVoucher] = useState(
    incomingVoucher ? normalizeVoucher(incomingVoucher) : null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const voucherId = voucherIdParam || incomingVoucher?.id;

  useEffect(() => {
    let isMounted = true;

    const fetchVoucher = async () => {
      if (!voucherId) {
        setError("Voucher ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await AdminPromoAPI.getVoucher(voucherId);
        const payload = getVoucherPayload(response);
        const normalizedVoucher = normalizeVoucher(payload);

        if (
          normalizedVoucher.products.length === 0 &&
          normalizedVoucher.productIds.length > 0
        ) {
          const productRequests = normalizedVoucher.productIds.map(
            async (productId, index) => {
              try {
                const productResponse =
                  await AdminInventoryAPI.getProductById(productId);
                return normalizeProduct(productResponse, index);
              } catch {
                return {
                  id: productId,
                  title: `Product #${productId}`,
                  category: "Unknown",
                  version: "N/A",
                };
              }
            },
          );

          normalizedVoucher.products = await Promise.all(productRequests);
        }

        if (isMounted) {
          setVoucher(normalizedVoucher);
        }
      } catch (fetchError) {
        console.error("Error fetching voucher details:", fetchError);
        if (isMounted) {
          const message =
            fetchError.message || "Failed to load voucher details.";
          setError(message);
          showErrorToast(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVoucher();

    return () => {
      isMounted = false;
    };
  }, [voucherId]);

  const statusMeta = useMemo(() => {
    if (!voucher) return { label: "N/A", tone: "inactive" };
    return getStatusMeta(voucher);
  }, [voucher]);

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="vouchers" />

        <main className="main view-voucher-wrapper">
          <AdminTopbar>
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

          <nav className="view-voucher-breadcrumb">
            <Link to="/vouchers">Vouchers</Link>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">View Voucher Details</span>
          </nav>

          <div className="view-voucher-header">
            <div>
              <h2>View Voucher Details</h2>
              <p className="header-subtitle">
                The information below displays the complete details of the
                selected voucher.
              </p>
            </div>
            <button
              type="button"
              className="btn-edit-content"
              onClick={() =>
                navigate("/vouchers/edit", {
                  state: {
                    voucher,
                  },
                })
              }
              disabled={!voucher || loading}
            >
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

          {loading ? (
            <div className="voucher-state-card">Loading voucher details...</div>
          ) : error ? (
            <div className="voucher-state-card voucher-state-card--error">
              {error}
            </div>
          ) : !voucher ? (
            <div className="voucher-state-card voucher-state-card--error">
              Voucher details are unavailable.
            </div>
          ) : (
            <div className="voucher-card">
              <div className="voucher-card-title">
                <span className="title-icon">
                  <IconDiscountFilled color="#F97316" />
                </span>
                <span className="title-text">Voucher Details</span>
              </div>

              <hr className="voucher-divider" />

              <div className="voucher-fields-row">
                <Field
                  label="Voucher Name"
                  value={voucher.description || `Voucher ${voucher.code}`}
                />
                <Field label="Voucher Code" value={voucher.code} mono />
                <Field
                  label="Discount Type"
                  value={getDiscountTypeLabel(voucher.type)}
                  center
                />
                <Field
                  label="Discount Value"
                  value={getDiscountValueLabel(voucher.type, voucher.value)}
                  center
                />
              </div>

              <div className="voucher-fields-row">
                <Field
                  label="Minimum Purchase Amount"
                  value={formatMoney(voucher.min_order_amount)}
                />
                <Field
                  label="Maximum Discount (for % type)"
                  value={formatMoney(voucher.max_discount)}
                />
                <Field
                  label="Available from"
                  value={formatDate(voucher.valid_from)}
                />
                <Field
                  label="Available to"
                  value={formatDate(voucher.valid_until)}
                />
              </div>

              <div className="voucher-fields-row">
                <Field
                  label="Usage Limit"
                  value={
                    voucher.max_uses
                      ? `${voucher.used_count}/${voucher.max_uses}`
                      : "Unlimited"
                  }
                />

                <div className="voucher-field">
                  <label>Status</label>
                  <span
                    className={`status-badge status-badge--${statusMeta.tone}`}
                  >
                    <span className="status-dot" />
                    {statusMeta.label}
                  </span>
                </div>

                <div className="voucher-field">
                  <label>Applicable to:</label>
                  <span className="field-value">
                    {getApplicableToLabel(
                      voucher.applicable_to,
                      voucher.products.length > 0,
                    )}
                  </span>
                </div>
              </div>

              <div className="products-section">
                <p className="products-label">Select (Select Multiple)</p>
                {voucher.products.length === 0 ? (
                  <p className="products-empty">
                    No specific products attached to this voucher.
                  </p>
                ) : (
                  <div className="products-grid">
                    {voucher.products.map((product) => (
                      <div className="product-item" key={product.id}>
                        <div className="product-thumbnail" />
                        <div className="product-info">
                          <span className="product-name">{product.title}</span>
                          <span className="product-meta">
                            {product.category} • {product.version}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
