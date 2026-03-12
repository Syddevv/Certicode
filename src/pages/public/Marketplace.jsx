import React, { useEffect, useState } from "react";
import "../../styles/Marketplace.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import ViewProduct from "../../assets/ViewProduct.png";
import { api } from "../../services/api";
import { ReviewAPI } from "../../services/ReviewAPI";
import WebsiteAppsIcon from "../../assets/website-apps.png";
import MobileAppsIcon from "../../assets/mobile-apps.png";
import UiUxDesignIcon from "../../assets/ui-ux-design.png";
import CustomProjIcon from "../../assets/custom-proj.png";

const getToneColor = (tech) => {
  const colorMap = {
    React: "blue",
    "Node.js": "green",
    Python: "gold",
    Django: "green",
    Flutter: "purple",
    Firebase: "pink",
    Swift: "indigo",
    Figma: "rose",
    "Adobe XD": "violet",
    Tailwind: "orange",
    Laravel: "red",
    "Vue.js": "green",
    HTML: "orange",
    CSS: "blue",
    JavaScript: "yellow",
    Stripe: "violet",
  };

  return colorMap[tech] || "green";
};

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("All Assets");
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [selectedRatingThreshold, setSelectedRatingThreshold] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    techStack: false,
    priceRange: false,
    ratings: true,
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 6,
    total: 0,
  });

  const tabs = [
    "All Assets",
    "Mobile App",
    "Website",
    "UI Kit",
    "Custom Projects",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSortDropdown &&
        !event.target.closest(".marketplace__sortContainer")
      ) {
        setShowSortDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showSortDropdown]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchAllTechs();
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedTechs, selectedPriceRange, selectedRatingThreshold, assets, activeTab]);

  const fetchAllTechs = async () => {
    try {
      const result = await api.getProducts();
      const allTechsSet = new Set();

      result.data.forEach((product) => {
        if (product.technologies) {
          product.technologies.forEach((tech) => allTechsSet.add(tech));
        }
      });

      setAvailableTechs(Array.from(allTechsSet).sort());
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

  const fetchProducts = async (
    search = "",
    assetType = "",
    page = 1,
    sortOrder = sortBy,
  ) => {
    try {
      setLoading(true);
      const result = await api.getProducts(search, assetType, page, sortOrder);
      const formattedAssets = await Promise.all(
        result.data.map(async (product) => {
          const assetType = product.asset_type || "Uncategorized";
          let mappedAssetType;

          if (
            assetType === "Mobile App" ||
            assetType === "Website" ||
            assetType === "UI Kit"
          ) {
            mappedAssetType = assetType;
          } else {
            mappedAssetType = "Custom Projects";
          }

          const apiRating = Number.parseFloat(
            product.average_rating ?? product.rating ?? 0,
          );
          let resolvedRating = Number.isFinite(apiRating) ? apiRating : 0;

          if (resolvedRating <= 0 && product.id) {
            try {
              const stats = await ReviewAPI.getReviewStats(product.id);
              const statsRating = Number.parseFloat(stats?.averageRating ?? 0);
              resolvedRating = Number.isFinite(statsRating) ? statsRating : 0;
            } catch (reviewError) {
              console.error(
                `Error fetching review stats for product ${product.id}:`,
                reviewError,
              );
            }
          }

          return {
            id: product.id,
            title: product.name,
            description: product.description,
            price: parseFloat(product.price),
            originalPrice: `$${product.price}`,
            path: `/marketplace/${product.id}`,
            featured_image: product.featured_image,
            asset_type: mappedAssetType,
            tags: product.technologies
              ? product.technologies.map((tech) => ({
                  label: tech,
                  tone: getToneColor(tech),
                }))
              : [],
            technologies: product.technologies || [],
            rating: resolvedRating,
            image_urls: product.images || [],
            features: product.features || [],
          };
        }),
      );

      setAssets(formattedAssets);
      setFilteredAssets(formattedAssets);

      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
        per_page: result.per_page,
        total: result.total,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...assets];

    if (activeTab !== "All Assets") {
      if (activeTab === "Custom Projects") {
        filtered = filtered.filter(
          (asset) =>
            asset.asset_type === "Custom Projects" ||
            (asset.asset_type !== "Mobile App" &&
              asset.asset_type !== "Website" &&
              asset.asset_type !== "UI Kit"),
        );
      } else {
        filtered = filtered.filter((asset) => asset.asset_type === activeTab);
      }
    }

    if (selectedTechs.length > 0) {
      filtered = filtered.filter((asset) =>
        selectedTechs.some((tech) => asset.technologies.includes(tech)),
      );
    }

    if (selectedPriceRange) {
      filtered = filtered.filter((asset) => {
        const price = asset.price;
        switch (selectedPriceRange) {
          case "Under $500":
            return price < 500;
          case "$500 - $2,000":
            return price >= 500 && price <= 2000;
          case "$2,000 - $5,000":
            return price >= 2000 && price <= 5000;
          default:
            return true;
        }
      });
    }

    if (selectedRatingThreshold) {
      const minimumRating = parseFloat(selectedRatingThreshold);
      filtered = filtered.filter(
        (asset) => parseFloat(asset.rating || 0) >= minimumRating,
      );
    }

    setFilteredAssets(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    let assetType = activeTab === "All Assets" ? "" : activeTab;

    if (assetType === "Custom Projects") {
      assetType = "";
    }

    fetchProducts(value, assetType, 1, sortBy);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    let assetType = tab === "All Assets" ? "" : tab;

    if (assetType === "Custom Projects") {
      assetType = "";
    }

    fetchProducts(searchTerm, assetType, 1, sortBy);
  };

  const handleTechChange = (tech) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const handlePriceChange = (range) => {
    setSelectedPriceRange(range === selectedPriceRange ? "" : range);
  };

  const handleRatingChange = (threshold) => {
    setSelectedRatingThreshold(
      threshold === selectedRatingThreshold ? "" : threshold,
    );
  };

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > pagination.last_page ||
      page === pagination.current_page
    )
      return;
    let assetType = activeTab === "All Assets" ? "" : activeTab;

    if (assetType === "Custom Projects") {
      assetType = "";
    }

    fetchProducts(searchTerm, assetType, page, sortBy);
  };

  const handleSortSelect = (value) => {
    setSortBy(value);
    setShowSortDropdown(false);

    let assetType = activeTab === "All Assets" ? "" : activeTab;
    if (assetType === "Custom Projects") {
      assetType = "";
    }

    fetchProducts(searchTerm, assetType, 1, value);
  };

  const toggleFilterGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const renderPagination = () => {
    const { current_page, last_page } = pagination;
    const pages = [];

    if (last_page <= 3) {
      for (let i = 1; i <= last_page; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2, 3);
      if (last_page > 3) {
        pages.push(last_page);
      }
    }

    const paginationItems = [];
    let prevPage = 0;

    pages.forEach((page) => {
      if (page - prevPage > 1 && prevPage !== 0) {
        paginationItems.push(
          <span key={`ellipsis-${page}`} className="marketplace__pageEllipsis">
            ...
          </span>,
        );
      }

      paginationItems.push(
        <button
          key={page}
          className={`marketplace__page ${current_page === page ? "marketplace__page--active" : ""}`}
          type="button"
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>,
      );

      prevPage = page;
    });

    return paginationItems;
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "newest":
        return "Most Recent";
      case "oldest":
        return "Oldest";
      case "highest":
        return "Highest Price";
      case "lowest":
        return "Lowest Price";
      default:
        return "Most Recent";
    }
  };

  return (
    <div>
      <Navbar />
      <section className="marketplace">
        <div className="marketplace__inner">
          <div className="marketplace__breadcrumb">
            <Link className="marketplace__crumb" to="/">
              Home
            </Link>
            <span className="marketplace__sep">›</span>
            <span className="marketplace__crumb marketplace__crumb--active">
              Marketplace
            </span>
          </div>

          <div className="marketplace__header">
            <h1>Explore Assets</h1>
            <p>
              Discover production-ready digital assets and templates curated for
              modern product teams.
            </p>
          </div>

          <div className="marketplace__tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`marketplace__tab${
                  activeTab === tab ? " marketplace__tab--active" : ""
                }`}
                onClick={() => handleTabClick(tab)}
                aria-pressed={activeTab === tab}
              >
                <span className="marketplace__tabLabel">{tab}</span>
              </button>
            ))}
          </div>

          <div className="marketplace__content">
            <aside className="marketplace__filters">
              <div className="marketplace__search">
                <span className="marketplace__searchIcon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M11 4a7 7 0 015.6 11.2l3.6 3.6-1.4 1.4-3.6-3.6A7 7 0 1111 4zm0 2a5 5 0 100 10 5 5 0 000-10z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="marketplace__searchInput"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <div className="marketplace__filterHeader">
                <h3>Filter</h3>
                <button type="button" className="marketplace__filterAction">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M6 7h12M6 12h12M6 17h12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="marketplace__filterGroup">
                <div className="marketplace__filterGroupHeader">
                  <h4>Tech Stack</h4>
                  <button
                    type="button"
                    className={`marketplace__filterToggle ${expandedGroups.techStack ? "marketplace__filterToggle--expanded" : ""}`}
                    onClick={() => toggleFilterGroup("techStack")}
                    aria-expanded={expandedGroups.techStack}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {expandedGroups.techStack && (
                  <div className="marketplace__filterGroupContent">
                    {availableTechs.map((tech) => (
                      <label key={tech} className="marketplace__check">
                        <input
                          type="checkbox"
                          checked={selectedTechs.includes(tech)}
                          onChange={() => handleTechChange(tech)}
                        />
                        <span>{tech}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="marketplace__filterGroup">
                <div className="marketplace__filterGroupHeader">
                  <h4>Price Range</h4>
                  <button
                    type="button"
                    className={`marketplace__filterToggle ${expandedGroups.priceRange ? "marketplace__filterToggle--expanded" : ""}`}
                    onClick={() => toggleFilterGroup("priceRange")}
                    aria-expanded={expandedGroups.priceRange}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {expandedGroups.priceRange && (
                  <div className="marketplace__filterGroupContent">
                    {["Under $500", "$500 - $2,000", "$2,000 - $5,000"].map(
                      (range) => (
                        <label key={range} className="marketplace__check">
                          <input
                            type="checkbox"
                            checked={selectedPriceRange === range}
                            onChange={() => handlePriceChange(range)}
                          />
                          <span>{range}</span>
                        </label>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="marketplace__filterGroup">
                <div className="marketplace__filterGroupHeader">
                  <h4>Ratings</h4>
                  <button
                    type="button"
                    className={`marketplace__filterToggle ${expandedGroups.ratings ? "marketplace__filterToggle--expanded" : ""}`}
                    onClick={() => toggleFilterGroup("ratings")}
                    aria-expanded={expandedGroups.ratings}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {expandedGroups.ratings && (
                  <div className="marketplace__filterGroupContent">
                    {[
                      { label: "4.5 & Up", value: "4.5" },
                      { label: "4.0 & Up", value: "4.0" },
                    ].map((item) => (
                      <label key={item.value} className="marketplace__check">
                        <input
                          type="checkbox"
                          checked={selectedRatingThreshold === item.value}
                          onChange={() => handleRatingChange(item.value)}
                        />
                        <span>
                          {item.label}
                          <span className="marketplace__stars">★★★★★</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            <div className="marketplace__results">
              <div className="marketplace__resultsHeader">
                <span>
                  Showing {filteredAssets.length} out of {pagination.total}{" "}
                  assets
                </span>
                <div className="marketplace__sortContainer">
                  <button
                    className="marketplace__sort"
                    type="button"
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                  >
                    Sort by: <strong>{getSortLabel()}</strong>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{
                        marginLeft: "8px",
                        transform: showSortDropdown ? "rotate(180deg)" : "none",
                      }}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {showSortDropdown && (
                    <div className="marketplace__sortDropdown">
                      <button
                        type="button"
                        className={`marketplace__sortOption ${sortBy === "newest" ? "marketplace__sortOption--active" : ""}`}
                        onClick={() => handleSortSelect("newest")}
                      >
                        Most Recent
                      </button>
                      <button
                        type="button"
                        className={`marketplace__sortOption ${sortBy === "oldest" ? "marketplace__sortOption--active" : ""}`}
                        onClick={() => handleSortSelect("oldest")}
                      >
                        Oldest
                      </button>
                      <button
                        type="button"
                        className={`marketplace__sortOption ${sortBy === "highest" ? "marketplace__sortOption--active" : ""}`}
                        onClick={() => handleSortSelect("highest")}
                      >
                        Highest Price
                      </button>
                      <button
                        type="button"
                        className={`marketplace__sortOption ${sortBy === "lowest" ? "marketplace__sortOption--active" : ""}`}
                        onClick={() => handleSortSelect("lowest")}
                      >
                        Lowest Price
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="marketplace__loading"></div>
              ) : (
                <div className="marketplace__cards">
                  {filteredAssets.map((asset) => (
                    <article key={asset.title} className="marketplace__card">
                      <div className="marketplace__cardMedia">
                        <img
                          src={asset.featured_image || ViewProduct}
                          alt={asset.title}
                          className="marketplace__cardImage"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = ViewProduct;
                          }}
                        />
                      </div>
                      <div className="marketplace__cardBody">
                        <div className="marketplace__tags">
                          {asset.tags.map((tag) => (
                            <span
                              key={tag.label}
                              className={`marketplace__tag marketplace__tag--${tag.tone}`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                        <h3>{asset.title}</h3>
                        <p>{asset.description}</p>
                        <div className="marketplace__cardFooter">
                          <div>
                            <span className="marketplace__priceLabel">
                              Starting from
                            </span>
                            <span className="marketplace__price">
                              {asset.originalPrice}
                            </span>
                          </div>
                          {asset.path ? (
                            <Link
                              className="marketplace__actionLink"
                              to={asset.path}
                              aria-label={`View ${asset.title}`}
                            >
                              <button
                                className="marketplace__action"
                                type="button"
                              >
                                <img
                                  src={ViewProduct}
                                  alt=""
                                  className="marketplace__actionIcon"
                                />
                              </button>
                            </Link>
                          ) : (
                            <button
                              className="marketplace__action"
                              type="button"
                            >
                              <img
                                src={ViewProduct}
                                alt="View product"
                                className="marketplace__actionIcon"
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div className="marketplace__pagination">
                <button
                  className="marketplace__page"
                  type="button"
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  ‹
                </button>

                {renderPagination()}

                <button
                  className="marketplace__page"
                  type="button"
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Marketplace;
