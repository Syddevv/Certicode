import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/MyPurchases.css";
import Avatar from "../../assets/Avatar.png";
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
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAssetType, setSelectedAssetType] = useState("All");

  const API_URL = "http://localhost:5000/api";

  const handleItemClick = (purchaseId) => {
    navigate(`/my-purchases/${purchaseId}`);
  };

  const handleItemKeyDown = (event, purchaseId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleItemClick(purchaseId);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
    fetchPurchases();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [searchQuery, purchases, selectedAssetType]);

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

  const downloadProductFile = async (productId) => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        alert('Please login to download files');
        throw new Error('Please login to download files');
      }
      
      const downloadUrl = `${API_URL}/products/${productId}/download`;
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = downloadUrl;
      
      iframe.onload = () => {
        console.log('Download iframe loaded');
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      };
      
      document.body.appendChild(iframe);
      
      window.open(downloadUrl, '_blank');
      
      return {
        success: true,
        message: 'Download started'
      };
      
    } catch (error) {
      console.error('Download error:', error);
      
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/products/${productId}/download`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `product-${productId}.zip`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          return {
            success: true,
            message: 'Download started via blob'
          };
        }
      } catch (fallbackError) {
        console.error('Fallback download error:', fallbackError);
        alert('Download failed. Please check if the backend server is running and try again.');
      }
      
      throw error;
    }
  };

  const handleDownload = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (productId) {
      try {
        await downloadProductFile(productId);
      } catch (error) {
        console.error('Download failed:', error.message);
      }
    } else {
      alert('No product ID available for download');
    }
  };

  const filterPurchases = () => {
    let filtered = purchases.filter(purchase => {
      const productName = purchase.product?.name?.toLowerCase() || "";
      const productCategory = purchase.product?.category?.toLowerCase() || "";
      
      const searchMatch = searchQuery.trim() === "" ||
        productName.includes(searchQuery.toLowerCase()) ||
        productCategory.includes(searchQuery.toLowerCase());
      
      if (!searchMatch) return false;
      
      if (selectedAssetType !== "All") {
        const purchaseType = getAssetType(purchase);
        if (selectedAssetType !== purchaseType) return false;
      }
      
      return true;
    });
    
    setFilteredPurchases(filtered);
  };

  const getAssetType = (purchase) => {
    const name = purchase.product?.name?.toLowerCase() || '';
    const category = purchase.product?.category?.toLowerCase() || '';
    
    if (name.includes('template') || category.includes('template')) return 'Templates';
    if (name.includes('ui kit') || name.includes('dashboard') || category.includes('ui')) return 'UI Kits';
    if (name.includes('app') || name.includes('mobile') || category.includes('app')) return 'Apps';
    return 'Other';
  };

  const toggleAssetType = (type) => {
    setSelectedAssetType(prev => prev === type ? "All" : type);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedAssetType("All");
  };

  const getAssetTags = (product) => {
    if (!product) return [{ label: "Digital", tone: "gray" }];
    
    const name = product.name?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    
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
      { keyword: "javascript", label: "JavaScript", tone: "yellow" },
      { keyword: "typescript", label: "TypeScript", tone: "blue" },
      { keyword: "python", label: "Python", tone: "blue" },
      { keyword: "java", label: "Java", tone: "orange" }
    ];
    
    const tags = [];
    techKeywords.forEach(tech => {
      if (name.includes(tech.keyword) || category.includes(tech.keyword)) {
        tags.push({ label: tech.label, tone: tech.tone });
      }
    });
    
    if (tags.length === 0) {
      tags.push({ label: "Digital", tone: "blue" });
    }
    
    return tags.slice(0, 2);
  };

  const getStatus = (purchase) => {
    if (purchase.license_key && purchase.license_key !== '') {
      return "Active";
    }
    return "Update Ready";
  };

  const getUpdatedDate = (purchased_at) => {
    if (!purchased_at) return "Updated Recently";
    const date = new Date(purchased_at);
    return `Updated ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  };

  const activeFilterCount = (searchQuery ? 1 : 0) + 
    (selectedAssetType !== "All" ? 1 : 0);

  return (
    <div>
      <Navbar />
      <section className="purchases">
        <div className="purchases__inner">
          <div className="purchases-profile">
            <div className="purchases-profile__info">
              <div className="purchases-profile__avatarWrap" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                border: '2px solid #e8e8e8'
              }}>
                <img
                  src={user?.avatar_url || Avatar}
                  alt={user?.name || "User"}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', user?.avatar_url);
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
            <button className="purchases-profile__edit" type="button">
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
                {activeFilterCount > 0 && (
                  <button 
                    className="purchases-clear" 
                    type="button"
                    onClick={clearAllFilters}
                  >
                    Clear Filters
                  </button>
                )}
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
                        <span className="purchases-search__icon" aria-hidden="true">
                          <img src={SearchIcon} alt="" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search your assets..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="purchases-filters__chips">
                      <button
                        className={`purchases-chip ${selectedAssetType === "All" ? "purchases-chip--active" : ""}`}
                        type="button"
                        onClick={() => toggleAssetType("All")}
                      >
                        All Assets
                      </button>
                      <button
                        className={`purchases-chip ${selectedAssetType === "Templates" ? "purchases-chip--active" : ""}`}
                        type="button"
                        onClick={() => toggleAssetType("Templates")}
                      >
                        Templates
                      </button>
                      <button
                        className={`purchases-chip ${selectedAssetType === "UI Kits" ? "purchases-chip--active" : ""}`}
                        type="button"
                        onClick={() => toggleAssetType("UI Kits")}
                      >
                        UI Kits
                      </button>
                      <button
                        className={`purchases-chip ${selectedAssetType === "Apps" ? "purchases-chip--active" : ""}`}
                        type="button"
                        onClick={() => toggleAssetType("Apps")}
                      >
                        Apps
                      </button>
                    </div>
                  </div>

                  <div className="purchases-list">
                    {filteredPurchases.length === 0 && purchases.length > 0 ? (
                      <div className="purchases-no-results">
                        <p>No assets found matching your search criteria.</p>
                        {activeFilterCount > 0 && (
                          <button 
                            className="purchases-btn"
                            type="button"
                            onClick={clearAllFilters}
                          >
                            Clear All Filters
                          </button>
                        )}
                      </div>
                    ) : (
                      filteredPurchases.map((purchase) => {
                        const tags = getAssetTags(purchase.product);
                        const status = getStatus(purchase);
                        const updatedDate = getUpdatedDate(purchase.purchased_at);
                        
                        return (
                          <article
                            key={purchase.id}
                            className="purchases-item purchases-item--link"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleItemClick(purchase.id)}
                            onKeyDown={(event) => handleItemKeyDown(event, purchase.id)}
                          >
                            <div 
                              className="purchases-item__media"
                              style={{
                                backgroundImage: purchase.product?.featured_image 
                                  ? `url(${purchase.product.featured_image})`
                                  : purchase.product?.images?.[0]
                                  ? `url(${purchase.product.images[0]})`
                                  : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: '#f5f5f5'
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
                              <h4>{purchase.product?.name || 'Unknown Product'}</h4>
                              <p>
                                {purchase.product?.category || 'Digital Product'} <span>{"\u2022"}</span> {purchase.product?.version || 'v1.0.0'}
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
                              <span className="purchases-updated">{updatedDate}</span>
                            </div>
                            <button
                              className="purchases-download"
                              type="button"
                              onClick={(event) => handleDownload(event, purchase.product?.id)}
                            >
                              <img src={WhiteDownload} alt="" aria-hidden="true" />
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
                      })
                    )}
                  </div>
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
                        <strong>{filteredPurchases[0].product?.version || 'v1.0.0'} Available</strong>
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
                      <div className="purchases-info__title">License Details</div>
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
                          <strong className="purchases-key">{filteredPurchases[0].license_key}</strong>
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

                    <button 
                      className="purchases-primary" 
                      type="button"
                      onClick={(event) => handleDownload(event, filteredPurchases[0].product?.id)}
                    >
                      <img src={WhiteDownload} alt="" aria-hidden="true" />
                      Download Latest ({filteredPurchases[0].product?.version || 'v1.0.0'})
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
                  <button
                    className="purchases-secondary purchases-secondary--filled"
                    type="button"
                  >
                    Learn More
                  </button>
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