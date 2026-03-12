import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../styles/adminOrderDetails.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import downloadIcon from "../../assets/whiteDownload.png";
import assetIcon from "../../assets/new-sale-e-commerce.png";
import pricingIcon from "../../assets/PricingIcon.png";
import filesIcon from "../../assets/files.png";
import licenseGenIcon from "../../assets/licensegen.png";
import transactionCompIcon from "../../assets/transactioncomp.png";
import refundArrowIcon from "../../assets/refund-arrow.png";
import fallbackAvatar from "../../assets/default-profile.png";
import { resolveAvatarUrl } from "../../utils/avatar";
import { AdminSalesAPI } from "../../services/AdminSalesAPI";
import { AdminCustomersAPI } from "../../services/AdminCustomersAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { downloadInvoicePdf } from "../../utils/invoicePdf";
import {
  formatAdminCurrency,
  loadAdminPlatformPreferences,
  subscribeAdminPlatformPreferences,
} from "../../utils/adminPlatformPreferences";

const COMPLETED_STATUSES = ["completed", "paid", "success", "succeeded"];

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const parsed = Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
};

const formatCurrency = (value, currencyCode = "USD") => {
  const amount = toNumber(value) ?? 0;
  return formatAdminCurrency(amount, currencyCode);
};

const formatDateTime = (value, fallback = "") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${dateLabel} • ${timeLabel}`;
};

const formatPlacedLabel = (value) => {
  if (!value) return "Placed date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Placed date unavailable";

  const dateLabel = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `Placed on ${dateLabel} at ${timeLabel}`;
};

const normalizeStatusClass = (status) => {
  const key = String(status || "").toLowerCase();
  if (COMPLETED_STATUSES.includes(key)) return "completed";
  if (["refunded", "cancelled", "failed"].includes(key)) return "refunded";
  return "pending";
};

const normalizeTags = (tags) => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags
      .map((tag) => {
        if (typeof tag === "string") return tag;
        if (tag && typeof tag === "object")
          return tag.name || tag.label || tag.value;
        return "";
      })
      .filter(Boolean);
  }

  if (typeof tags === "string") {
    return tags
      .split(/[,|]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const formatAddress = (address) => {
  if (!address) return "No billing address available";

  if (typeof address === "string") {
    return address;
  }

  const lineOne = [address.line1, address.line2].filter(Boolean).join(", ");
  const lineTwo = [
    address.city,
    address.state,
    address.postal_code || address.zip_code,
  ]
    .filter(Boolean)
    .join(", ");
  const lineThree = address.country;

  return (
    [lineOne, lineTwo, lineThree].filter(Boolean).join("\n") ||
    "No billing address available"
  );
};

const pickTimelineIcon = (title, index) => {
  const key = String(title || "").toLowerCase();
  if (key.includes("payment")) return pricingIcon;
  if (key.includes("file")) return filesIcon;
  if (key.includes("license")) return licenseGenIcon;
  if (key.includes("complete") || key.includes("final"))
    return transactionCompIcon;

  const fallback = [
    pricingIcon,
    filesIcon,
    licenseGenIcon,
    transactionCompIcon,
  ];
  return fallback[index] || pricingIcon;
};

const buildFallbackTimeline = (order, isCompleted) => {
  const orderedSteps = [
    {
      title: "Payment Received",
      timestamp: order.paid_at || order.purchased_at || order.created_at,
      icon: pricingIcon,
      color: "orange",
    },
    {
      title: "Files Delivered",
      timestamp: order.files_delivered_at || order.updated_at,
      icon: filesIcon,
      color: "orange",
    },
    {
      title: "License Generated",
      timestamp: order.license_generated_at || order.updated_at,
      icon: licenseGenIcon,
      color: "orange",
    },
    {
      title: "Transaction Complete",
      subtitle: "Finalized by System",
      timestamp: order.completed_at || order.updated_at,
      icon: transactionCompIcon,
      color: isCompleted ? "green" : "orange",
    },
  ];

  return orderedSteps.map((item) => ({
    ...item,
    timeLabel: item.subtitle || formatDateTime(item.timestamp, "Pending"),
  }));
};

const normalizeOrderPayload = (data) => {
  const payload = data?.data ?? data ?? {};
  const order = payload.order ?? payload.order_details ?? payload;
  const customer =
    payload.customer ?? order?.customer ?? payload.user ?? order?.user ?? {};
  const asset = payload.asset ?? order?.asset ?? order?.product ?? {};
  const payment =
    payload.payment_method ??
    payload.payment ??
    order?.payment_method ??
    order?.payment ??
    {};
  const security =
    payload.security_log ??
    order?.security_log ??
    payload.security ??
    order?.security ??
    {};
  const transactionHistory =
    payload.transaction_history ??
    order?.transaction_history ??
    payload.timeline ??
    order?.timeline ??
    [];

  return {
    order: order || {},
    customer: customer || {},
    asset: asset || {},
    payment: payment || {},
    security: security || {},
    transactionHistory: Array.isArray(transactionHistory)
      ? transactionHistory
      : [],
    invoiceUrl:
      payload.invoice_url ||
      order?.invoice_url ||
      payload.invoice?.download_url ||
      order?.invoice?.download_url ||
      null,
  };
};

const AdminOrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const routeOrder = location.state?.order || null;
  const [loading, setLoading] = useState(!routeOrder);
  const [downloading, setDownloading] = useState(false);
  const [resolvedCustomerId, setResolvedCustomerId] = useState(null);
  const [resolvingCustomerId, setResolvingCustomerId] = useState(false);
  const [platformPreferences, setPlatformPreferences] = useState(() =>
    loadAdminPlatformPreferences(),
  );
  const [error, setError] = useState("");
  const [details, setDetails] = useState(() =>
    routeOrder ? normalizeOrderPayload({ order: routeOrder }) : null,
  );

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) {
        setError("Order ID is missing from the URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await AdminSalesAPI.getOrderDetails(id);
        setDetails(normalizeOrderPayload(response));
      } catch (fetchError) {
        const message = fetchError.message || "Failed to load order details.";
        if (!routeOrder) {
          setError(message);
          showErrorToast(message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, routeOrder]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!details?.customer && !details?.order) return;

      const customerId =
        details?.customer?.id ||
        details?.customer?.customer_id ||
        details?.order?.customer_id;

      if (!customerId) return;

      const hasCoreCustomerDetails = Boolean(
        details?.customer?.email &&
        (details?.customer?.billing_address ||
          details?.customer?.address ||
          details?.customer?.company),
      );

      if (hasCoreCustomerDetails) return;

      try {
        const customerResponse =
          await AdminCustomersAPI.getCustomerDetails(customerId);
        const payload = customerResponse?.data ?? customerResponse ?? {};
        const normalizedCustomer =
          payload.customer ?? payload.user ?? payload.data ?? payload ?? {};

        setDetails((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            customer: {
              ...(prev.customer || {}),
              ...(normalizedCustomer || {}),
            },
          };
        });
      } catch (customerError) {
        console.error(
          "Failed to load customer details for order:",
          customerError,
        );
      }
    };

    fetchCustomerDetails();
  }, [
    details?.customer?.id,
    details?.customer?.customer_id,
    details?.order?.customer_id,
  ]);

  useEffect(() => {
    setPlatformPreferences(loadAdminPlatformPreferences());
    return subscribeAdminPlatformPreferences((nextPreferences) => {
      setPlatformPreferences(nextPreferences);
    });
  }, []);

  useEffect(() => {
    const directCustomerId =
      details?.customer?.id ||
      details?.customer?.customer_id ||
      details?.customer?.user_id ||
      details?.order?.customer_id ||
      details?.order?.user_id ||
      details?.order?.customer?.id ||
      details?.order?.user?.id ||
      null;

    if (directCustomerId) {
      setResolvedCustomerId(null);
      return;
    }

    const customerEmail =
      details?.customer?.email ||
      details?.order?.customer_email ||
      details?.order?.email ||
      "";
    const customerName =
      details?.customer?.name || details?.order?.customer_name || "";

    const query = String(customerEmail || customerName).trim();
    if (!query) return;

    let cancelled = false;

    const resolveCustomerId = async () => {
      setResolvingCustomerId(true);
      try {
        const response = await AdminCustomersAPI.getCustomers(1, query, "", 50);
        const customersCollection = response?.customers;
        const items = Array.isArray(customersCollection)
          ? customersCollection
          : Array.isArray(customersCollection?.data)
            ? customersCollection.data
            : [];

        const normalizedEmail = String(customerEmail).trim().toLowerCase();
        const normalizedName = String(customerName).trim().toLowerCase();

        const match =
          items.find(
            (item) =>
              normalizedEmail &&
              String(item?.email || "")
                .trim()
                .toLowerCase() === normalizedEmail,
          ) ||
          items.find(
            (item) =>
              normalizedName &&
              String(item?.name || "")
                .trim()
                .toLowerCase() === normalizedName,
          ) ||
          items[0];

        const matchedId = match?.id || match?.customer_id || null;
        if (!cancelled) {
          setResolvedCustomerId(matchedId);
        }
      } catch (lookupError) {
        if (!cancelled) {
          setResolvedCustomerId(null);
        }
        console.error("Failed to resolve customer profile ID:", lookupError);
      } finally {
        if (!cancelled) {
          setResolvingCustomerId(false);
        }
      }
    };

    resolveCustomerId();

    return () => {
      cancelled = true;
    };
  }, [
    details?.customer?.id,
    details?.customer?.customer_id,
    details?.customer?.user_id,
    details?.customer?.email,
    details?.customer?.name,
    details?.order?.customer_id,
    details?.order?.user_id,
    details?.order?.customer?.id,
    details?.order?.user?.id,
    details?.order?.customer_email,
    details?.order?.customer_name,
    details?.order?.email,
  ]);

  const viewModel = useMemo(() => {
    if (!details) return null;

    const {
      order,
      customer,
      asset,
      payment,
      security,
      transactionHistory,
      invoiceUrl,
    } = details;

    const statusRaw = String(
      order.status || order.payment_status || "pending",
    ).toLowerCase();
    const isCompleted = COMPLETED_STATUSES.includes(statusRaw);

    const assetTags = normalizeTags(
      asset.tags ||
        asset.tech_stack ||
        order.tech_stack ||
        order.asset_tags ||
        order.tags,
    );

    const resolvedTimeline = transactionHistory.length
      ? transactionHistory.map((entry, index) => {
          const title =
            entry.title || entry.event || entry.name || `Step ${index + 1}`;
          const timestamp =
            entry.timestamp || entry.created_at || entry.date || entry.time;
          const eventStatus = String(entry.status || "").toLowerCase();
          const completed =
            entry.completed === true ||
            ["completed", "done", "success", "paid", "succeeded"].includes(
              eventStatus,
            );

          return {
            title,
            icon: pickTimelineIcon(title, index),
            color:
              completed && index === transactionHistory.length - 1
                ? "green"
                : "orange",
            timeLabel:
              entry.subtitle ||
              formatDateTime(timestamp, completed ? "Completed" : "Pending"),
          };
        })
      : buildFallbackTimeline(order, isCompleted);

    const customerAddress =
      customer.billing_address ||
      customer.address ||
      order.billing_address ||
      order.customer_address ||
      null;

    const customerSubline = [
      customer.job_title || customer.position || customer.role,
      customer.company || customer.company_name || order.customer_company,
    ]
      .filter(Boolean)
      .join(", ");

    const paymentBrand =
      payment.brand ||
      payment.card_brand ||
      order.card_brand ||
      order.payment_card_brand ||
      "VISA";
    const paymentLast4 =
      payment.last4 ||
      payment.card_last4 ||
      order.card_last4 ||
      order.payment_last4;

    return {
      orderId: order.order_number || order.order_id || `#ORD-${id}`,
      placedLabel: formatPlacedLabel(
        order.purchased_at || order.paid_at || order.created_at,
      ),
      totalAmount: formatCurrency(
        order.total_amount || order.amount || order.grand_total,
        platformPreferences.currency,
      ),
      statusLabel: statusRaw.toUpperCase(),
      statusClass: normalizeStatusClass(statusRaw),
      paymentVerified: isCompleted,
      assetName:
        asset.name ||
        order.asset_name ||
        order.product_name ||
        order.product?.name ||
        "Digital Asset",
      assetLicense:
        asset.license_name ||
        order.license_type ||
        order.license_name ||
        "Full Source Code License (Commercial)",
      assetTags,
      assetPrice: formatCurrency(
        asset.price || order.item_price || order.total_amount || order.amount,
        platformPreferences.currency,
      ),
      customerId:
        customer.id ||
        customer.customer_id ||
        customer.user_id ||
        order.customer_id ||
        order.user_id ||
        order.customer?.id ||
        order.user?.id ||
        null,
      customerName: customer.name || order.customer_name || "Customer",
      customerSubline,
      customerAvatar:
        resolveAvatarUrl(
          customer.avatar_url || customer.avatar || order.customer_avatar,
        ) || fallbackAvatar,
      customerEmail:
        customer.email || order.customer_email || "No email available",
      customerAddress: formatAddress(customerAddress),
      taxId: customer.tax_id || customer.vat_id || order.tax_id || "N/A",
      paymentMethod: paymentLast4
        ? `${String(paymentBrand).toUpperCase()} Ending in ${paymentLast4}`
        : String(paymentBrand).toUpperCase(),
      paymentAuthCode:
        payment.auth_code ||
        payment.authorization_code ||
        order.auth_code ||
        order.payment_auth_code ||
        "Not available",
      securityIp: security.ip_address || order.ip_address || "Not available",
      securityBrowser: security.browser || order.browser || "Not available",
      securityHash:
        security.security_hash || order.security_hash || "Not available",
      timeline: resolvedTimeline,
      invoiceUrl,
      orderPk: order.id || id,
    };
  }, [details, id, platformPreferences.currency]);

  const customerProfileId = viewModel?.customerId || resolvedCustomerId;

  const handleDownloadInvoice = async () => {
    if (!viewModel?.orderPk) {
      showErrorToast("Order ID is missing. Unable to download invoice.");
      return;
    }

    if (viewModel.invoiceUrl) {
      const link = document.createElement("a");
      link.href = viewModel.invoiceUrl;
      link.download = `invoice_${viewModel.orderPk}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccessToast(
        `Invoice download started: invoice_${viewModel.orderPk}.pdf`,
      );
      return;
    }

    try {
      setDownloading(true);
      await AdminSalesAPI.downloadInvoice(viewModel.orderPk);
      showSuccessToast(
        `Invoice download started: invoice_${viewModel.orderPk}.pdf`,
      );
    } catch (downloadError) {
      try {
        const filename = downloadInvoicePdf({
          invoiceNumber: `INV-${viewModel.orderPk}`,
          orderNumber: viewModel.orderId,
          issuedDate: (() => {
            const placed = String(viewModel.placedLabel || "");
            const match = placed.match(/Placed on (.+?) at/);
            return match?.[1] || "Unknown Date";
          })(),
          status: viewModel.statusLabel,
          billedToName: viewModel.customerName,
          billedToLine: viewModel.customerAddress,
          productName: viewModel.assetName,
          productId: viewModel.orderPk,
          licenseLabel: viewModel.assetLicense,
          subtotal: viewModel.assetPrice,
          tax: "$0.00",
          discount: "$0.00",
          total: viewModel.totalAmount,
        });
        showSuccessToast(
          `Print dialog opened for ${filename}. Choose "Save as PDF".`,
        );
      } catch (fallbackError) {
        console.error("Admin invoice fallback export failed:", fallbackError);
        showErrorToast(downloadError.message || "Failed to download invoice.");
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="sales" />

        <main className="main admin-order-main">
          <AdminTopbar showSearch={false} className="admin-order-topbar">
            {viewModel && (
              <span className="verified-badge">
                <span className="dot-green">●</span>
                {viewModel.paymentVerified
                  ? "Payment Verified"
                  : "Payment Pending"}
              </span>
            )}
            <button
              className="btn primary download-btn"
              type="button"
              onClick={handleDownloadInvoice}
              disabled={loading || downloading || !viewModel}
            >
              <img
                src={downloadIcon}
                alt="Download"
                className="download-icon-img"
              />
              {downloading ? "Downloading..." : "Download Invoice"}
            </button>
          </AdminTopbar>

          <section className="admin-order-content">
            <div className="breadcrumb">
              <Link to="/sales" className="breadcrumb-link">
                Orders
              </Link>
              <span className="separator">›</span>
              <span className="current">Order Details</span>
            </div>

            {viewModel ? (
              <div className="order-details-layout">
                <div className="order-main-content">
                  <div className="card main-card">
                    <div className="order-header-split">
                      <div>
                        <span className="label-sm">ORDER ID</span>
                        <h2>{viewModel.orderId}</h2>
                        <p className="meta-text">{viewModel.placedLabel}</p>
                      </div>
                      <div className="text-right">
                        <span className="label-sm">TOTAL AMOUNT</span>
                        <h2 className="price-large">{viewModel.totalAmount}</h2>
                        <span
                          className={`status-pill ${viewModel.statusClass}`}
                        >
                          ● {viewModel.statusLabel}
                        </span>
                      </div>
                    </div>

                    <div className="asset-section">
                      <h4 className="section-label">ASSET DETAILS</h4>
                      <div className="asset-box">
                        <div className="asset-icon-placeholder">
                          <img
                            src={assetIcon}
                            alt={viewModel.assetName}
                            className="asset-main-icon"
                          />
                        </div>
                        <div className="asset-info">
                          <h3>{viewModel.assetName}</h3>
                          <p>{viewModel.assetLicense}</p>
                          {viewModel.assetTags.length > 0 && (
                            <div className="tags-row">
                              {viewModel.assetTags.map((tag) => (
                                <span key={tag} className="tag">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="asset-price">
                          {viewModel.assetPrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="card-title">TRANSACTION HISTORY</h3>
                    <div className="timeline-horizontal">
                      {viewModel.timeline.map((entry, index) => (
                        <div className="t-step" key={`${entry.title}-${index}`}>
                          <div className={`t-icon ${entry.color}`}>
                            <img
                              src={entry.icon}
                              alt={entry.title}
                              className="timeline-icon-img"
                            />
                          </div>
                          <div className="t-content">
                            <h4>{entry.title}</h4>
                            <span>{entry.timeLabel}</span>
                          </div>
                          {index !== viewModel.timeline.length - 1 && (
                            <div className="t-line active"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="card-title">PAYMENT METHOD</h3>
                    <div className="payment-row">
                      <div className="visa-badge">
                        {viewModel.paymentMethod.split(" ")[0]}
                      </div>
                      <div className="payment-details">
                        <strong>{viewModel.paymentMethod}</strong>
                        <p>Auth Code: {viewModel.paymentAuthCode}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <aside className="order-sidebar">
                  <div className="card customer-card">
                    <h3 className="card-title">CUSTOMER INFORMATION</h3>

                    <div className="customer-header">
                      <img
                        src={viewModel.customerAvatar}
                        alt={viewModel.customerName}
                        className="customer-avatar"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = fallbackAvatar;
                        }}
                      />
                      <div>
                        <h4>{viewModel.customerName}</h4>
                        {viewModel.customerSubline && (
                          <p className="role-text">
                            {viewModel.customerSubline}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="info-group">
                      <label>EMAIL ADDRESS</label>
                      {viewModel.customerEmail.includes("@") ? (
                        <a href={`mailto:${viewModel.customerEmail}`}>
                          {viewModel.customerEmail}
                        </a>
                      ) : (
                        <p>{viewModel.customerEmail}</p>
                      )}
                    </div>

                    <div className="info-group">
                      <label>BILLING ADDRESS</label>
                      <p className="multiline-value">
                        {viewModel.customerAddress}
                      </p>
                    </div>

                    <div className="info-group">
                      <label>TAX ID</label>
                      <p className="tax-text">{viewModel.taxId}</p>
                    </div>

                    {customerProfileId ? (
                      <Link
                        to={`/customers/${customerProfileId}`}
                        className="btn-outline"
                      >
                        View Customer Profile
                      </Link>
                    ) : (
                      <button className="btn-outline" type="button" disabled>
                        {resolvingCustomerId
                          ? "Locating Customer..."
                          : "View Customer Profile"}
                      </button>
                    )}
                  </div>

                  <div className="refund-section">
                    <button className="btn-refund" type="button">
                      <img
                        src={refundArrowIcon}
                        alt=""
                        className="refund-icon"
                      />
                      Refund Order
                    </button>
                  </div>

                  <div className="card security-card">
                    <h3 className="card-title">SECURITY LOG</h3>
                    <div className="log-row">
                      <span className="log-label">IP Address</span>
                      <span className="log-value">{viewModel.securityIp}</span>
                    </div>
                    <div className="log-row">
                      <span className="log-label">Browser</span>
                      <span className="log-value">
                        {viewModel.securityBrowser}
                      </span>
                    </div>
                    <div className="log-row">
                      <span className="log-label">Security Hash</span>
                      <span className="log-value">
                        {viewModel.securityHash}
                      </span>
                    </div>
                  </div>
                </aside>
              </div>
            ) : loading ? (
              <div className="card order-message-card">
                Loading order details...
              </div>
            ) : error ? (
              <div className="card order-message-card order-message-error">
                {error}
              </div>
            ) : (
              <div className="card order-message-card order-message-error">
                Unable to load order details.
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminOrderDetails;
