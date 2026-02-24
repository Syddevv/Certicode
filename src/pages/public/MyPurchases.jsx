import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/MyPurchases.css";
import Avatar from "../../assets/default-profile.png";
import { resolveAvatarUrl } from "../../utils/avatar";
import VerifiedBadge from "../../assets/Verified.png";
import ArrowDown from "../../assets/ArrowDown.png";
import SearchIcon from "../../assets/lucide_search.png";
import WhiteDownload from "../../assets/whiteDownload.png";
import OrangeBadge from "../../assets/orangeBadge.png";
import OrangeStar from "../../assets/orangestar.png";
import { ProfileAPI } from "../../services/ProfileAPI";

const MyPurchases = () => {
  const navigate = useNavigate();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("All");
  const [techStackFilter, setTechStackFilter] = useState("All");
  const [licenseFilter, setLicenseFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const techStackLabels = [
    "React",
    "Node.js",
    "Vue",
    "Angular",
    "Laravel",
    "PHP",
    "Flutter",
    "Firebase",
    "Figma",
    "Adobe XD",
    "Sketch",
  ];

  const createAssetSlug = (value = "") =>
    String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleItemClick = (purchase) => {
    if (!purchase) return;
    const productName =
      purchase.product?.name || `asset-${purchase.id || "detail"}`;
    const assetSlug =
      createAssetSlug(productName) || `asset-${purchase.id || "detail"}`;
    navigate(`/my-purchases/${assetSlug}`, {
      state: { purchase },
    });
  };

  const handleItemKeyDown = (event, purchase) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleItemClick(purchase);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
    fetchPurchases();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await ProfileAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const data = await ProfileAPI.getUserPurchases();
      setPurchases(data.purchases || []);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeText = (value) => {
    if (!value) return "";
    return String(value).toLowerCase().trim();
  };

  const toTitleCase = (value) => {
    if (!value) return "";
    return String(value)
      .replace(/[_-]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(
        /\w\S*/g,
        (word) => word[0].toUpperCase() + word.slice(1).toLowerCase(),
      );
  };

  const getAssetTypeLabel = (product) => {
    const raw =
      product?.category ||
      product?.type ||
      product?.asset_type ||
      product?.product_type ||
      "Digital Product";
    return toTitleCase(raw);
  };

  const getAssetTags = (product) => {
    if (!product) return [{ label: "Digital", tone: "gray" }];

    const name = product.name?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    const techKeywords = [
      { keyword: "react", label: "React", tone: "blue" },
      { keyword: "node", label: "Node.js", tone: "green" },
      { keyword: "vue", label: "Vue", tone: "green" },
      { keyword: "angular", label: "Angular", tone: "red" },
      { keyword: "laravel", label: "Laravel", tone: "red" },
      { keyword: "php", label: "PHP", tone: "orange" },
      { keyword: "flutter", label: "Flutter", tone: "purple" },
      { keyword: "firebase", label: "Firebase", tone: "pink" },
      { keyword: "figma", label: "Figma", tone: "rose" },
      { keyword: "adobe", label: "Adobe XD", tone: "violet" },
      { keyword: "sketch", label: "Sketch", tone: "orange" },
      { keyword: "saas", label: "SaaS", tone: "blue" },
      { keyword: "template", label: "Template", tone: "green" },
      { keyword: "app", label: "App", tone: "purple" },
      { keyword: "dashboard", label: "Dashboard", tone: "violet" },
      { keyword: "ui kit", label: "UI Kit", tone: "rose" },
    ];

    const tags = [];
    techKeywords.forEach((tech) => {
      if (name.includes(tech.keyword) || category.includes(tech.keyword)) {
        tags.push({ label: tech.label, tone: tech.tone });
      }
    });

    if (tags.length === 0) {
      tags.push({ label: "Digital", tone: "blue" });
    }

    return tags.slice(0, 2);
  };

  const getTechStackLabels = (product) => {
    const tags = getAssetTags(product).map((tag) => tag.label);
    const fromTags = tags.filter((label) => techStackLabels.includes(label));

    const rawTech = product?.tech_stack || product?.techStack;
    const fromField = Array.isArray(rawTech)
      ? rawTech.map((entry) => toTitleCase(entry))
      : rawTech
        ? rawTech
            .split(",")
            .map((entry) => toTitleCase(entry))
            .filter(Boolean)
        : [];

    return Array.from(new Set([...fromTags, ...fromField]));
  };

  const getStatus = (purchase) => {
    if (purchase.license_key && purchase.license_key !== "") {
      return "Active";
    }
    return "Update Ready";
  };

  const getUpdatedDate = (purchased_at) => {
    if (!purchased_at) return "Updated Recently";
    const date = new Date(purchased_at);
    return `Updated ${date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  const assetTypeOptions = React.useMemo(() => {
    const types = new Set();
    purchases.forEach((purchase) => {
      types.add(getAssetTypeLabel(purchase.product));
    });
    return Array.from(types).sort((a, b) => a.localeCompare(b));
  }, [purchases]);

  const techStackOptions = React.useMemo(() => {
    const stacks = new Set();
    purchases.forEach((purchase) => {
      getTechStackLabels(purchase.product).forEach((label) =>
        stacks.add(label),
      );
    });
    return Array.from(stacks).sort((a, b) => a.localeCompare(b));
  }, [purchases]);

  const filteredPurchases = React.useMemo(() => {
    const searchValue = normalizeText(searchTerm);

    const matchesFilters = (purchase) => {
      const product = purchase.product || {};
      const assetTypeLabel = getAssetTypeLabel(product);
      const techLabels = getTechStackLabels(product);
      const status = getStatus(purchase);

      const searchBlob = [
        product.name,
        product.category,
        assetTypeLabel,
        ...techLabels,
      ]
        .map((value) => normalizeText(value))
        .filter(Boolean)
        .join(" ");

      const matchesSearch =
        searchValue.length === 0 || searchBlob.includes(searchValue);
      const matchesAssetType =
        assetTypeFilter === "All" || assetTypeLabel === assetTypeFilter;
      const matchesTechStack =
        techStackFilter === "All" || techLabels.includes(techStackFilter);
      const matchesLicense =
        licenseFilter === "All" || status === licenseFilter;

      return (
        matchesSearch && matchesAssetType && matchesTechStack && matchesLicense
      );
    };

    const getPurchaseDateValue = (purchase) => {
      const dateValue =
        purchase.purchased_at ||
        purchase.created_at ||
        purchase.date ||
        purchase.paid_at;
      const date = dateValue ? new Date(dateValue) : null;
      return date && !Number.isNaN(date.getTime()) ? date.getTime() : 0;
    };

    const sorted = purchases.filter(matchesFilters).sort((a, b) => {
      if (sortBy === "recent") {
        return getPurchaseDateValue(b) - getPurchaseDateValue(a);
      }
      if (sortBy === "oldest") {
        return getPurchaseDateValue(a) - getPurchaseDateValue(b);
      }
      if (sortBy === "name-asc") {
        return normalizeText(a.product?.name).localeCompare(
          normalizeText(b.product?.name),
        );
      }
      if (sortBy === "name-desc") {
        return normalizeText(b.product?.name).localeCompare(
          normalizeText(a.product?.name),
        );
      }
      if (sortBy === "status") {
        const statusOrder = { Active: 0, "Update Ready": 1 };
        return (
          (statusOrder[getStatus(a)] ?? 99) - (statusOrder[getStatus(b)] ?? 99)
        );
      }
      return 0;
    });

    return sorted;
  }, [
    purchases,
    searchTerm,
    assetTypeFilter,
    techStackFilter,
    licenseFilter,
    sortBy,
  ]);

  const clearFilters = () => {
    setSearchTerm("");
    setAssetTypeFilter("All");
    setTechStackFilter("All");
    setLicenseFilter("All");
    setSortBy("recent");
  };

  return (
    <div>
      <Navbar />
      <section className="purchases">
        <div className="purchases__inner">
          <div className="purchases-profile">
            <div className="purchases-profile__info">
              <div
                className="purchases-profile__avatarWrap"
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #e8e8e8",
                }}
              >
                <img
                  src={resolveAvatarUrl(user?.avatar_url) || Avatar}
                  alt={user?.name || "User"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", user?.avatar_url);
                    e.target.src = Avatar;
                    e.target.onerror = null;
                  }}
                />
                <span
                  className="purchases-profile__status"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2>{user?.name || "Jane Doe"}</h2>
                <span className="purchases-profile__badge">
                  <img src={VerifiedBadge} alt="" aria-hidden="true" />
                  Verified User
                </span>
              </div>
            </div>
            <button
              className="purchases-profile__edit"
              type="button"
              onClick={() => navigate("/account-settings")}
            >
              <span className="purchases-profile__editIcon" aria-hidden="true">
                {"\u270e"}
              </span>
              Edit Profile
            </button>
          </div>

          <div className="purchases-tabs">
            <Link className="purchases-tab" to="/buyer-dashboard">
              Dashboard
            </Link>
            <button
              className="purchases-tab purchases-tab--active"
              type="button"
            >
              My Purchases
            </button>
            <Link className="purchases-tab" to="/billing-invoices">
              Billing & Invoices
            </Link>
            <button className="purchases-tab" type="button">
              <Link className="buyer-tab" to="/account-settings">
                Account Settings
              </Link>
            </button>
            <Link className="purchases-tab" to="/customer-support">
              Support
            </Link>
          </div>

          <div className="purchases__content">
            <div className="purchases-main">
              <div className="purchases-main__header">
                <h3>Your Asset Library</h3>
              </div>

              {loading ? (
                <div className="purchases-loading">Loading purchases...</div>
              ) : purchases.length === 0 ? (
                <div className="purchases-empty">
                  <p>No purchases yet. Visit the marketplace to get started.</p>
                  <Link to="/marketplace" className="purchases-btn">
                    Browse Marketplace
                  </Link>
                </div>
              ) : (
                <>
                  <div className="purchases-filters">
                    <div className="purchases-filters__top">
                      <div className="purchases-search">
                        <span
                          className="purchases-search__icon"
                          aria-hidden="true"
                        >
                          <img src={SearchIcon} alt="" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search your assets by name or tech stack..."
                          value={searchTerm}
                          onChange={(event) =>
                            setSearchTerm(event.target.value)
                          }
                        />
                      </div>
                      <button
                        className="purchases-action"
                        type="button"
                        onClick={() => setFiltersOpen((prev) => !prev)}
                      >
                        <span
                          className="purchases-action__icon"
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M4 6h16M7 12h10M10 18h4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        Filter
                      </button>
                      <label className="purchases-action purchases-action--select">
                        <span
                          className="purchases-action__icon"
                          aria-hidden="true"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M7 6h10M5 12h14M9 18h6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </span>
                        Sort by
                        <select
                          className="purchases-actionSelect"
                          value={sortBy}
                          onChange={(event) => setSortBy(event.target.value)}
                          aria-label="Sort purchases"
                        >
                          <option value="recent">Newest</option>
                          <option value="oldest">Oldest</option>
                          <option value="name-asc">Name (A-Z)</option>
                          <option value="name-desc">Name (Z-A)</option>
                          <option value="status">Status</option>
                        </select>
                      </label>
                    </div>

                    {filtersOpen && (
                      <div className="purchases-filters__chips">
                        <label
                          className={`purchases-chip${assetTypeFilter !== "All" ? " purchases-chip--active" : ""}`}
                        >
                          Asset Type:
                          <select
                            className="purchases-chipSelect"
                            value={assetTypeFilter}
                            onChange={(event) =>
                              setAssetTypeFilter(event.target.value)
                            }
                          >
                            <option value="All">All</option>
                            {assetTypeOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label
                          className={`purchases-chip${techStackFilter !== "All" ? " purchases-chip--active" : ""}`}
                        >
                          Tech Stack
                          <select
                            className="purchases-chipSelect"
                            value={techStackFilter}
                            onChange={(event) =>
                              setTechStackFilter(event.target.value)
                            }
                          >
                            <option value="All">All</option>
                            {techStackOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                          <img src={ArrowDown} alt="" aria-hidden="true" />
                        </label>
                        <label
                          className={`purchases-chip${licenseFilter !== "All" ? " purchases-chip--active" : ""}`}
                        >
                          License Status
                          <select
                            className="purchases-chipSelect"
                            value={licenseFilter}
                            onChange={(event) =>
                              setLicenseFilter(event.target.value)
                            }
                          >
                            <option value="All">All</option>
                            <option value="Active">Active</option>
                            <option value="Update Ready">Update Ready</option>
                          </select>
                          <img src={ArrowDown} alt="" aria-hidden="true" />
                        </label>
                        <button
                          className="purchases-clear"
                          type="button"
                          onClick={clearFilters}
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>

                  {filteredPurchases.length === 0 ? (
                    <div className="purchases-empty">
                      <p>No assets match your current search or filters.</p>
                      <button
                        className="purchases-btn"
                        type="button"
                        onClick={clearFilters}
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="purchases-list">
                      {filteredPurchases.map((purchase) => {
                        const tags = getAssetTags(purchase.product);
                        const status = getStatus(purchase);
                        const updatedDate = getUpdatedDate(
                          purchase.purchased_at,
                        );

                        return (
                          <article
                            key={purchase.id}
                            className={`purchases-item purchases-item--link`}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleItemClick(purchase)}
                            onKeyDown={(event) =>
                              handleItemKeyDown(event, purchase)
                            }
                          >
                            <div
                              className="purchases-item__media"
                              style={{
                                backgroundImage: purchase.product
                                  ?.featured_image
                                  ? `url(${purchase.product.featured_image})`
                                  : purchase.product?.images?.[0]
                                    ? `url(${purchase.product.images[0]})`
                                    : "none",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                backgroundColor: "#f5f5f5",
                              }}
                            />
                            <div className="purchases-item__body">
                              <div className="purchases-item__tags">
                                {tags.map((tag) => (
                                  <span
                                    key={tag.label}
                                    className={`purchases-tag purchases-tag--${tag.tone}`}
                                  >
                                    {tag.label}
                                  </span>
                                ))}
                              </div>
                              <h4>
                                {purchase.product?.name || "Unknown Product"}
                              </h4>
                              <p>
                                {getAssetTypeLabel(purchase.product)}{" "}
                                <span>{"\u2022"}</span>{" "}
                                {purchase.product?.version || "v1.0.0"}
                              </p>
                            </div>
                            <div className="purchases-item__meta">
                              <span
                                className={`purchases-status${
                                  status === "Update Ready" ? " is-warning" : ""
                                }`}
                              >
                                <span className="purchases-status__dot" />
                                {status}
                              </span>
                              <span className="purchases-updated">
                                {updatedDate}
                              </span>
                            </div>
                            <button
                              className="purchases-download"
                              type="button"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <img
                                src={WhiteDownload}
                                alt=""
                                aria-hidden="true"
                              />
                              Download
                            </button>
                            <button
                              className="purchases-more"
                              type="button"
                              aria-label="More options"
                              onClick={(event) => event.stopPropagation()}
                            >
                              ...
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            <aside className="purchases-side">
              <div className="purchases-card">
                <div className="purchases-card__header">
                  <h4>Selected Asset</h4>
                  <button
                    className="purchases-close"
                    type="button"
                    aria-label="Close"
                  >
                    {"\u00d7"}
                  </button>
                </div>

                {filteredPurchases.length > 0 && (
                  <>
                    <div className="purchases-update">
                      <div className="purchases-update__icon">
                        <img src={OrangeBadge} alt="" aria-hidden="true" />
                      </div>
                      <div>
                        <strong>
                          {filteredPurchases[0].product?.version || "v1.0.0"}{" "}
                          Available
                        </strong>
                        <p>
                          Critical security patches and new Dark Mode components
                          added.
                        </p>
                        <button className="purchases-link" type="button">
                          View Changelog
                        </button>
                      </div>
                    </div>

                    <div className="purchases-info">
                      <div className="purchases-info__title">
                        License Details
                      </div>
                      <div className="purchases-info__row">
                        <span>License Type</span>
                        <strong>Commercial License</strong>
                      </div>
                      <div className="purchases-info__row">
                        <span>Usage</span>
                        <strong>Perpetual</strong>
                      </div>
                      {filteredPurchases[0].license_key && (
                        <div className="purchases-info__row">
                          <span>Key</span>
                          <strong className="purchases-key">
                            {filteredPurchases[0].license_key}
                          </strong>
                        </div>
                      )}
                    </div>

                    <div className="purchases-info">
                      <div className="purchases-info__title">Asset Info</div>
                      <div className="purchases-info__row">
                        <span>File Size</span>
                        <strong>42.5 MB</strong>
                      </div>
                      <div className="purchases-info__row">
                        <span>Format</span>
                        <strong>ZIP Archive (.tgz)</strong>
                      </div>
                      <div className="purchases-info__row">
                        <span>Author</span>
                        <strong className="purchases-author">
                          CertiCode Core Team
                        </strong>
                      </div>
                    </div>

                    <button className="purchases-primary" type="button">
                      <img src={WhiteDownload} alt="" aria-hidden="true" />
                      Download Latest (
                      {filteredPurchases[0].product?.version || "v1.0.0"})
                    </button>
                    <button className="purchases-secondary" type="button">
                      View Full License
                    </button>
                    <Link className="purchases-alert" to="/customer-support">
                      Report Issue
                    </Link>
                  </>
                )}
              </div>

              <div className="purchases-card purchases-cta">
                <div className="purchases-cta__body">
                  <h5>Need Custom Development?</h5>
                  <p>
                    Extend your assets with tailored features, integrations, or
                    workflows built by our enterprise team.
                  </p>
                  <Link to="/custom-service">
                    {" "}
                    <button
                      className="purchases-secondary purchases-secondary--filled"
                      type="button"
                    >
                      Learn More
                    </button>
                  </Link>
                </div>
                <img
                  className="purchases-cta__spark"
                  src={OrangeStar}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MyPurchases;
