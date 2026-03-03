import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/PurchasedAssetDetail.css";
import DocumentationAndResources from "../../assets/DocumentationAndResources.png";
import IncludedFilesIcon from "../../assets/IncludedFiles.png";
import GuideIcon from "../../assets/guide.png";
import ZipIcon from "../../assets/zip.png";
import LicensedIcon from "../../assets/Licensed.png";
import ShareIcon from "../../assets/ShareIcon.png";
import WhiteDownload from "../../assets/whiteDownload.png";
import OrangeDownload from "../../assets/orangeDownload.png";
import LatestVersionIcon from "../../assets/latestver.png";
import OrangeCalendar from "../../assets/orangeCalendar.png";
import InvoiceIcon from "../../assets/Invoice.png";
import ViewProductIcon from "../../assets/ViewProduct.png";
import OrangeStar from "../../assets/orangestar.png";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const API_URL = `${(import.meta.env.VITE_API_URL || "").replace(/\/+$/, "")}/api`;

const PurchasedAssetDetail = () => {
  const [activeTab, setActiveTab] = useState("version");
  const [isDownloading, setIsDownloading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fallbackPurchase = {
    id: "ORD-99283-CX",
    order_number: "ORD-99283-CX",
    purchased_at: "2026-01-20",
    product: {
      name: "E-commerce SaaS Template",
      description:
        "Complete multivendor marketplace solution with admin dashboard and full control over vendors, products, orders, and payouts.",
      version: "v2.4.1",
      category: "Template",
      featured_image: "",
      images: [],
      tech_stack: ["Node.js", "React"],
    },
  };

  const purchase = location.state?.purchase || fallbackPurchase;
  const product = purchase.product || fallbackPurchase.product;
  const productId = product?.id || purchase.product_id || null;

  const rawTechStack = Array.isArray(product.tech_stack)
    ? product.tech_stack
    : typeof product.tech_stack === "string"
    ? product.tech_stack.split(",")
    : [];

  const derivedTags = rawTechStack
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 2);

  const tags =
    derivedTags.length > 0
      ? derivedTags
      : [product.category || "Digital Product", "Asset"].slice(0, 2);

  const orderNumber =
    purchase.order_number ||
    purchase.order?.order_number ||
    purchase.order?.id ||
    purchase.id ||
    "ORD-99283-CX";

  const version = product.version || "v2.4.1";
  const fileSize = product.file_size || product.download_size || "42.5 MB";
  const heroImage = product.featured_image || product.images?.[0] || "";

  const purchaseDateRaw =
    purchase.purchased_at ||
    purchase.created_at ||
    purchase.date ||
    purchase.paid_at ||
    fallbackPurchase.purchased_at;
  const purchaseDateValue = purchaseDateRaw ? new Date(purchaseDateRaw) : null;
  const purchaseDate =
    purchaseDateValue && !Number.isNaN(purchaseDateValue.getTime())
      ? purchaseDateValue.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Jan 20, 2026";

  const licenseType =
    purchase.license_type ||
    purchase.license?.type ||
    purchase.license?.name ||
    "Commercial License - Perpetual";

  const setupGuideUrl =
    product?.setup_guide_url ||
    product?.documentation_url ||
    product?.docs_url ||
    product?.guide_url ||
    purchase?.setup_guide_url ||
    null;

  const handleDownload = async () => {
    if (!productId) {
      showErrorToast("No product found for download.");
      return;
    }

    try {
      setIsDownloading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        showErrorToast("Please login to download files");
        return;
      }

      const response = await fetch(`${API_URL}/products/${productId}/download`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        showErrorToast("Authentication failed. Please login again.");
        return;
      }

      if (response.status === 403) {
        showErrorToast("You need to purchase this product to download files.");
        return;
      }

      if (response.status === 404) {
        showErrorToast("No files found for this product.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();

      let filename = "download.zip";
      const disposition = response.headers.get("content-disposition");
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      showSuccessToast(`Download started: ${filename}`);

      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error("Download failed:", error);
      showErrorToast(error.message || "Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewMarketplace = () => {
    if (productId) {
      navigate(`/marketplace/${productId}`);
      return;
    }
    navigate("/marketplace");
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareData = {
      title: product.name || "Purchased Asset",
      text: `Check my purchased asset: ${product.name || "Purchased Asset"}`,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showSuccessToast("Link copied to clipboard.");
        return;
      }

      showErrorToast("Sharing is not supported on this device.");
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.error("Share failed:", error);
        showErrorToast("Failed to share link.");
      }
    }
  };

  const handleOpenSetupGuide = () => {
    if (setupGuideUrl) {
      window.open(setupGuideUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (productId) {
      navigate(`/marketplace/${productId}`);
      showSuccessToast("Opening asset details to view documentation.");
      return;
    }

    showErrorToast("Setup guide is not available for this asset.");
  };

  const handleChangelog = () => {
    if (productId) {
      navigate(`/marketplace/${productId}`);
      showSuccessToast("Opening marketplace details for version info.");
      return;
    }
    showErrorToast("Changelog is not available for this asset.");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="purchased-detail">
        <div className="purchased-detail__inner">
          <div className="purchased-detail__breadcrumb">
            <Link className="purchased-detail__crumb" to="/my-purchases">
              My Purchases
            </Link>
            <span className="purchased-detail__sep">›</span>
            <span className="purchased-detail__crumb purchased-detail__crumb--active">
              {product.name || "Purchased Asset"}
            </span>
          </div>

          <div className="purchased-detail__top">
            <div className="purchased-detail__media">
              <div
                className="purchased-detail__hero"
                aria-hidden="true"
                style={
                  heroImage
                    ? {
                        backgroundImage: `url(${heroImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="purchased-detail__thumbs">
                {Array.from({ length: 4 }).map((_, index) => (
                  <button
                    key={`thumb-${index}`}
                    className="purchased-detail__thumb"
                    type="button"
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>

            <aside className="purchased-detail__summary">
              <div className="purchased-detail__tags">
                {tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className={`purchased-detail__tag purchased-detail__tag--${
                      index % 2 === 0 ? "green" : "blue"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h1>{product.name || "Purchased Asset"}</h1>
              <p>
                {product.description ||
                  "Complete multivendor marketplace solution with admin dashboard and full control over vendors, products, orders, and payouts."}
              </p>
              <div className="purchased-detail__summaryActions">
                <button
                  className="purchased-detail__download"
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading || !productId}
                >
                  <img src={WhiteDownload} alt="" aria-hidden="true" />
                  {isDownloading
                    ? "Downloading..."
                    : `Download Asset (${fileSize})`}
                </button>
                <div className="purchased-detail__actions">
                  <button
                    className="purchased-detail__iconBtn"
                    type="button"
                    onClick={handleShare}
                    aria-label="Share asset link"
                  >
                    <img src={ShareIcon} alt="" aria-hidden="true" />
                  </button>
                  <button
                    className="purchased-detail__ghostBtn"
                    type="button"
                    onClick={handleViewMarketplace}
                  >
                    <img src={ViewProductIcon} alt="" aria-hidden="true" />
                    View Details on Marketplace
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <div className="purchased-detail__stats">
            <div className="purchased-detail__stat">
              <span className="purchased-detail__statIcon">
                <img src={InvoiceIcon} alt="" aria-hidden="true" />
              </span>
              <div>
                <p>Order Number</p>
                <strong>{orderNumber}</strong>
              </div>
            </div>
            <div className="purchased-detail__stat">
              <span className="purchased-detail__statIcon">
                <img src={LatestVersionIcon} alt="" aria-hidden="true" />
              </span>
              <div>
                <p>Latest Version</p>
                <strong>{version}</strong>
              </div>
            </div>
            <div className="purchased-detail__stat">
              <span className="purchased-detail__statIcon">
                <img src={OrangeCalendar} alt="" aria-hidden="true" />
              </span>
              <div>
                <p>Purchase Date</p>
                <strong>{purchaseDate}</strong>
              </div>
            </div>
          </div>

          <div className="purchased-detail__grid">
            <div className="purchased-detail__main">
              <section className="purchased-detail__section">
                <div className="purchased-detail__sectionTitle">
                  <img
                    src={DocumentationAndResources}
                    alt=""
                    aria-hidden="true"
                  />
                  <h3>Documentation & Resources</h3>
                </div>
                <button
                  className="purchased-detail__resourceCard"
                  type="button"
                  onClick={handleOpenSetupGuide}
                >
                  <div className="purchased-detail__resourceIcon">
                    <img src={GuideIcon} alt="" aria-hidden="true" />
                  </div>
                  <div>
                    <h4>Setup Guide</h4>
                    <span>PDF & Online Docs</span>
                  </div>
                  <span className="purchased-detail__resourceArrow">›</span>
                </button>
              </section>

              <section className="purchased-detail__section">
                <div className="purchased-detail__sectionTitle purchased-detail__sectionTitle--spread">
                  <div>
                    <img src={IncludedFilesIcon} alt="" aria-hidden="true" />
                    <h3>Included Files</h3>
                  </div>
                  <span className="purchased-detail__muted">Total 1 file</span>
                </div>
                <div className="purchased-detail__fileRow">
                  <div className="purchased-detail__fileIcon">
                    <img src={ZipIcon} alt="" aria-hidden="true" />
                  </div>
                  <div>
                    <h4>{`${(product.name || "Asset_Package").replace(/\s+/g, "_")}.zip`}</h4>
                    <span>{`${fileSize} • Updated ${purchaseDate}`}</span>
                  </div>
                  <button
                    className="purchased-detail__fileDownload"
                    type="button"
                    onClick={handleDownload}
                    disabled={isDownloading || !productId}
                  >
                    <img src={OrangeDownload} alt="" aria-hidden="true" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                </div>
              </section>
            </div>

            <aside className="purchased-detail__side">
              <div className="purchased-detail__card">
                <div className="purchased-detail__cardTitle">
                  <img src={LicensedIcon} alt="" aria-hidden="true" />
                  <h4>License & Support</h4>
                </div>
                <div className="purchased-detail__cardGroup">
                  <span>License Type</span>
                  <strong>{licenseType}</strong>
                  <p>
                    Unlimited projects for your company. No renewal fees
                    required.
                  </p>
                </div>
                <hr />
                <div className="purchased-detail__cardGroup">
                  <span>Support Status</span>
                  <strong>{purchase.license_key ? "Active License" : "Support Available"}</strong>
                  <p>{purchase.license_key ? "License key linked to this purchase." : "Contact support for renewal details."}</p>
                </div>
                <Link className="purchased-detail__supportBtn" to="/contact">
                  Contact Technical Support
                </Link>
                <span className="purchased-detail__footnote">
                  Typical response time &lt; 24 hrs
                </span>
              </div>

              <div className="purchased-detail__card purchased-detail__upgrade">
                <div>
                  <h4>Need a custom license?</h4>
                  <p>
                    We offer Enterprise and Unlimited Site options for larger
                    teams.
                  </p>
                  <button
                    className="purchased-detail__upgradeBtn"
                    type="button"
                    onClick={() => navigate("/custom-service")}
                  >
                    Upgrade License
                  </button>
                </div>
                <img
                  src={OrangeStar}
                  alt=""
                  aria-hidden="true"
                  className="purchased-detail__upgradeArt"
                />
              </div>
            </aside>
          </div>

          <section className="purchased-detail__history">
            <div className="purchased-detail__tabs">
              <button
                className={`purchased-detail__tab${
                  activeTab === "version" ? " is-active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("version")}
              >
                Version History
              </button>
              <button
                className={`purchased-detail__tab${
                  activeTab === "download" ? " is-active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("download")}
              >
                Download Log
              </button>
            </div>

            <div className="purchased-detail__table">
              <div className="purchased-detail__tableHead">
                <span>Version</span>
                <span>Release Date</span>
                <span>Key Changes</span>
                <span>Actions</span>
              </div>
              {activeTab === "version" ? (
                <>
                  {[
                    {
                      version: "v2.1.4",
                      date: "Oct 12, 2023",
                      changes:
                        "Fixed responsive issues in Admin Dashboard; Updated icon set.",
                    },
                    {
                      version: "v2.1.0",
                      date: "Aug 05, 2023",
                      changes:
                        "Initial 2.0 architecture migration. New dark mode components.",
                    },
                    {
                      version: "v2.0.8",
                      date: "June 18, 2023",
                      changes:
                        "Small bugfixes for form validation states and typography tweaks.",
                    },
                  ].map((row) => (
                    <div
                      key={row.version}
                      className="purchased-detail__tableRow"
                    >
                      <span>{row.version}</span>
                      <span>{row.date}</span>
                      <span>{row.changes}</span>
                      <button
                        className="purchased-detail__tableLink"
                        type="button"
                        onClick={handleChangelog}
                      >
                        Changelog
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    {
                      version: "v2.4.1",
                      date: "Jan 20, 2026",
                      changes: "Downloaded by Jane Doe (192.168.1.10)",
                    },
                    {
                      version: "v2.4.0",
                      date: "Dec 18, 2025",
                      changes: "Downloaded by Jane Doe (192.168.1.10)",
                    },
                  ].map((row) => (
                    <div
                      key={row.version}
                      className="purchased-detail__tableRow"
                    >
                      <span>{row.version}</span>
                      <span>{row.date}</span>
                      <span>{row.changes}</span>
                      <span className="purchased-detail__statusTag">
                        Completed
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PurchasedAssetDetail;
