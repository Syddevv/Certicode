import React, { useEffect, useState } from "react";
import "../../styles/Marketplace.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import ViewProduct from "../../assets/ViewProduct.png";
import { api } from "../../services/api";

const getToneColor = (tech) => {
  const colorMap = {
    'React': 'blue',
    'Node.js': 'green',
    'Python': 'gold',
    'Django': 'green',
    'Flutter': 'purple',
    'Firebase': 'pink',
    'Swift': 'indigo',
    'Figma': 'rose',
    'Adobe XD': 'violet',
    'Tailwind': 'orange',
    'Laravel': 'red',
    'Vue.js': 'green',
    'HTML': 'orange',
    'CSS': 'blue',
    'JavaScript': 'yellow',
    'Stripe': 'violet',
  };
  
  return colorMap[tech] || 'green';
};

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("All Assets");
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [availableTechs, setAvailableTechs] = useState([]);
  const [availableAssetTypes, setAvailableAssetTypes] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 6,
    total: 0
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchAllTechs();
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedTechs, selectedPriceRange, assets, activeTab]);

  const fetchAllTechs = async () => {
    try {
      const result = await api.getProducts();
      const allTechsSet = new Set();
      const assetTypesSet = new Set();
      
      result.data.forEach(product => {
        if (product.technologies) {
          product.technologies.forEach(tech => allTechsSet.add(tech));
        }
        if (product.asset_type) {
          assetTypesSet.add(product.asset_type);
        }
      });
      
      setAvailableTechs(Array.from(allTechsSet).sort());
      setAvailableAssetTypes(Array.from(assetTypesSet).sort());
    } catch (error) {
      console.error("Error fetching technologies:", error);
    }
  };

  const fetchProducts = async (search = "", assetType = "", page = 1) => {
    try {
      setLoading(true);
      const result = await api.getProducts(search, assetType, page);
      
      // In your fetchProducts function, update the formatting:
      const formattedAssets = result.data.map(product => ({
        id: product.id, // ADD THIS - CRITICAL!
        title: product.name,
        description: product.description,
        price: parseFloat(product.price),
        originalPrice: `$${product.price}`,
        path: `/marketplace/${product.id}`,
        asset_type: product.asset_type || "Uncategorized",
        tags: product.technologies ? 
          product.technologies.map(tech => ({
            label: tech,
            tone: getToneColor(tech)
          })) : [],
        technologies: product.technologies || [],
        // Add other fields that ProductDetails might need
        rating: product.rating || "4.8",
        image_urls: product.images || [],
        features: product.features || []
      }));
      
      setAssets(formattedAssets);
      setFilteredAssets(formattedAssets);
      
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
        per_page: result.per_page,
        total: result.total
      });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...assets];

    // Filter by selected tab (asset_type)
    if (activeTab !== "All Assets") {
      filtered = filtered.filter(asset => asset.asset_type === activeTab);
    }

    if (selectedTechs.length > 0) {
      filtered = filtered.filter(asset =>
        selectedTechs.some(tech => asset.technologies.includes(tech))
      );
    }

    if (selectedPriceRange) {
      filtered = filtered.filter(asset => {
        const price = asset.price;
        switch(selectedPriceRange) {
          case "Under $500": return price < 500;
          case "$500 - $2,000": return price >= 500 && price <= 2000;
          case "$2,000 - $5,000": return price >= 2000 && price <= 5000;
          default: return true;
        }
      });
    }

    setFilteredAssets(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const assetType = activeTab === "All Assets" ? "" : activeTab;
    fetchProducts(value, assetType, 1);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const assetType = tab === "All Assets" ? "" : tab;
    fetchProducts(searchTerm, assetType, 1);
  };

  const handleTechChange = (tech) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter(t => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const handlePriceChange = (range) => {
    setSelectedPriceRange(range === selectedPriceRange ? "" : range);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.last_page || page === pagination.current_page) return;
    const assetType = activeTab === "All Assets" ? "" : activeTab;
    fetchProducts(searchTerm, assetType, page);
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
    
    pages.forEach(page => {
      if (page - prevPage > 1 && prevPage !== 0) {
        paginationItems.push(
          <span key={`ellipsis-${page}`} className="marketplace__pageEllipsis">
            ...
          </span>
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
        </button>
      );
      
      prevPage = page;
    });
    
    return paginationItems;
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
            <button
              key="All Assets"
              type="button"
              className={`marketplace__tab${
                activeTab === "All Assets" ? " marketplace__tab--active" : ""
              }`}
              onClick={() => handleTabClick("All Assets")}
              aria-pressed={activeTab === "All Assets"}
            >
              <span className="marketplace__tabLabel">All Assets</span>
            </button>
            
            {availableAssetTypes.map((assetType) => (
              <button
                key={assetType}
                type="button"
                className={`marketplace__tab${
                  activeTab === assetType ? " marketplace__tab--active" : ""
                }`}
                onClick={() => handleTabClick(assetType)}
                aria-pressed={activeTab === assetType}
              >
                <span className="marketplace__tabLabel">{assetType}</span>
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
                <h4>Tech Stack</h4>
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

              <div className="marketplace__filterGroup">
                <h4>Price Range</h4>
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

              <div className="marketplace__filterGroup">
                <h4>Ratings</h4>
                {["4.5 & Up", "4.0 & Up"].map((item) => (
                  <label key={item} className="marketplace__check">
                    <input type="checkbox" />
                    <span>
                      {item}
                      <span className="marketplace__stars">★★★★★</span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="marketplace__filterGroup">
                <h4>Delivery Time</h4>
                <select className="marketplace__select" defaultValue="Anytime">
                  <option>Anytime</option>
                  <option>24 Hours</option>
                  <option>3 Days</option>
                  <option>1 Week</option>
                </select>
              </div>
            </aside>

            <div className="marketplace__results">
              <div className="marketplace__resultsHeader">
                <span>Showing {filteredAssets.length} out of {pagination.total} assets</span>
                <button className="marketplace__sort" type="button">
                  Sort by: <strong>Newest First</strong>
                  <span className="marketplace__sortIcon">▾</span>
                </button>
              </div>

              {loading ? (
                <div className="marketplace__loading"></div>
              ) : (
                <div className="marketplace__cards">
                  {filteredAssets.map((asset) => (
                    <article key={asset.title} className="marketplace__card">
                      <div className="marketplace__cardMedia" />
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
                            <button className="marketplace__action" type="button">
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