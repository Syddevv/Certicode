import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BuyerDashboard.css";
import Avatar from "../../assets/default-profile.png";
import { resolveAvatarUrl } from "../../utils/avatar";
import VerifiedBadge from "../../assets/Verified.png";
import OrangeBadge from "../../assets/orangeBadge.png";
import OrangeBag from "../../assets/orangeBag.png";
import OrangeBox from "../../assets/orangeBox.png";
import OrangeDownload from "../../assets/orangeDownload.png";
import LicensedRenewed from "../../assets/licensedRenewed.png";
import InvoiceIcon from "../../assets/Invoice.png";
import OrangeStar from "../../assets/orangestar.png";
import BillingSupportIcon from "../../assets/billingSupport.png";
import CustomerSupportIcon from "../../assets/CustomerSupport.png";
import WhiteDownload from "../../assets/whiteDownload.png";
import { ProfileAPI } from "../../services/ProfileAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const API_URL = 'http://127.0.0.1:8000/api';

const BuyerDashboard = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [downloading, setDownloading] = useState({});
  const [downloadMessage, setDownloadMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState([
    { label: "Total Assets", value: "0", icon: OrangeBox },
    { label: "Active Licenses", value: "0", icon: OrangeBadge },
    { label: "Last Purchase", value: "Never", icon: OrangeBag },
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
    fetchPurchases();
  }, []);

  useEffect(() => {
    filterPurchases();
  }, [searchQuery, purchases]);

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
      const userPurchases = data.purchases || [];
      setPurchases(userPurchases);
      setFilteredPurchases(userPurchases.slice(0, 3));
      
      const totalAssets = userPurchases.length;
      const activeLicenses = userPurchases.filter(p => p.license_key && p.license_key !== '').length;
      
      let lastPurchase = 'Never';
      if (userPurchases.length > 0) {
        const latestPurchase = userPurchases[0];
        const purchaseDate = new Date(latestPurchase.purchased_at);
        lastPurchase = purchaseDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
      
      setStats([
        { label: "Total Assets", value: totalAssets.toString(), icon: OrangeBox },
        { label: "Active Licenses", value: activeLicenses.toString(), icon: OrangeBadge },
        { label: "Last Purchase", value: lastPurchase, icon: OrangeBag },
      ]);
      
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      setPurchases([]);
      setFilteredPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPurchases = () => {
    if (!searchQuery.trim()) {
      setFilteredPurchases(purchases.slice(0, 3));
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = purchases.filter(purchase => {
      const productName = purchase.product?.name?.toLowerCase() || '';
      const productCategory = purchase.product?.category?.toLowerCase() || '';
      const productDesc = purchase.product?.description?.toLowerCase() || '';
      
      return productName.includes(query) || 
             productCategory.includes(query) || 
             productDesc.includes(query);
    });
    
    setFilteredPurchases(filtered);
  };

  const handleDownload = async (productId) => {
    try {
      setDownloading(prev => ({...prev, [productId]: true}));
      
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        showErrorToast("Please login to download files");
        setDownloading(prev => ({...prev, [productId]: false}));
        return;
      }
      
      const response = await fetch(`${API_URL}/products/${productId}/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 401) {
        showErrorToast("Authentication failed. Please login again.");
        setDownloading(prev => ({...prev, [productId]: false}));
        return;
      }
      
      if (response.status === 403) {
        showErrorToast("You need to purchase this product to download files.");
        setDownloading(prev => ({...prev, [productId]: false}));
        return;
      }
      
      if (response.status === 404) {
        showErrorToast("No files found for this product.");
        setDownloading(prev => ({...prev, [productId]: false}));
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }
      
      const blob = await response.blob();
      
      let filename = 'download.zip';
      const disposition = response.headers.get('content-disposition');
      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      showSuccessToast(`Download started: ${filename}`);
      
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      setDownloading(prev => ({...prev, [productId]: false}));
      
    } catch (error) {
      console.error('Download failed:', error);
      showErrorToast(error.message || "Failed to download. Please try again.");
      setDownloading(prev => ({...prev, [productId]: false}));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
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
      { keyword: "ui kit", label: "UI Kit", tone: "rose" }
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

  const activities = purchases.slice(0, 3).map(purchase => ({
    title: `Purchased: ${purchase.product?.name || 'Unknown Product'}`,
    time: purchase.purchased_at 
      ? new Date(purchase.purchased_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Recently',
    icon: OrangeDownload,
  }));

  const fallbackActivities = [
    {
      title: "License renewed for E-commerce SaaS Template",
      time: "1 day ago",
      icon: LicensedRenewed,
    },
    {
      title: "Invoice #INV-9281 generated",
      time: "5 days ago",
      icon: InvoiceIcon,
    }
  ];

  const displayActivities = activities.length > 0 
    ? activities 
    : fallbackActivities.slice(0, 3);

  const supportItems = [
    {
      title: "Priority Help Desk",
      desc: "Average response time < 2h",
      icon: CustomerSupportIcon,
    },
    {
      title: "Billing Support",
      desc: "Invoices, refunds, & billing cycles",
      icon: BillingSupportIcon,
    },
  ];

  return (
    <div>
      <Navbar />
      {downloadMessage && (
        <div className="buyer-dashboard__message">
          {downloadMessage}
        </div>
      )}
      <section className="buyer-dashboard">
        <div className="buyer-dashboard__inner">
          <div className="buyer-card buyer-profile">
            <div className="buyer-profile__info">
              <div className="buyer-profile__avatarWrap" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                border: '2px solid #e8e8e8'
              }}>
                <img
                  src={resolveAvatarUrl(user?.avatar_url) || Avatar}
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
                <span className="buyer-profile__status" aria-hidden="true" />
              </div>
              <div>
                <h2>{user?.name || "Jane Doe"}</h2>
                <span className="buyer-profile__badge">
                  <img src={VerifiedBadge} alt="" aria-hidden="true" />
                  Verified User
                </span>
              </div>
            </div>
            <Link to="/account-settings">
              <button className="buyer-profile__edit" type="button">
                <span className="buyer-profile__editIcon" aria-hidden="true">
                  {"\u270e"}
                </span>
                Edit Profile
              </button>
            </Link>
          </div>

          <div className="buyer-tabs">
            <button className="buyer-tab buyer-tab--active" type="button">
              Dashboard
            </button>
            <Link className="buyer-tab" to="/my-purchases">
              My Purchases
            </Link>
            <Link className="buyer-tab" to="/billing-invoices">
              Billing & Invoices
            </Link>
            <Link className="buyer-tab" to="/account-settings">
              Account Settings
            </Link>
            <Link className="buyer-tab" to="/customer-support">
              Support
            </Link>
          </div>

          <div className="buyer-dashboard__content">
            <div className="buyer-main">
              <div className="buyer-main__header">
                <h3>Dashboard</h3>
              </div>

              <div className="buyer-stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="buyer-stat">
                    <div className="buyer-stat__icon">
                      <img src={stat.icon} alt="" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="buyer-stat__label">{stat.label}</span>
                      <div className="buyer-stat__value">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="buyer-section">
                <div className="buyer-section__header">
                  <h4>Purchased Assets</h4>
                  <div className="buyer-search">
                    <span className="buyer-search__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M11 4a7 7 0 015.6 11.2l3.6 3.6-1.4 1.4-3.6-3.6A7 7 0 1111 4zm0 2a5 5 0 100 10 5 5 0 000-10z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      placeholder="Search assets..." 
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchQuery && (
                      <button 
                        className="buyer-search__clear"
                        onClick={clearSearch}
                        type="button"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {loading ? (
                  <div className="buyer-loading">Loading purchases...</div>
                ) : filteredPurchases.length === 0 ? (
                  <div className="buyer-empty">
                    <p>
                      {searchQuery 
                        ? `No purchases found for "${searchQuery}"`
                        : 'No purchases yet. Visit the marketplace to get started.'}
                    </p>
                    {!searchQuery && (
                      <Link to="/marketplace" className="buyer-btn">
                        Browse Marketplace
                      </Link>
                    )}
                    {searchQuery && (
                      <button 
                        className="buyer-btn" 
                        onClick={clearSearch}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="buyer-assets">
                      {filteredPurchases.slice(0, 6).map((purchase) => {
                        const tags = getAssetTags(purchase.product);
                        return (
                          <article key={purchase.id} className="buyer-asset">
                            <div 
                              className="buyer-asset__media"
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
                            <div className="buyer-asset__body">
                              <div className="buyer-asset__tags">
                                {tags.map((tag) => (
                                  <span
                                    key={tag.label}
                                    className={`buyer-tag buyer-tag--${tag.tone}`}
                                  >
                                    {tag.label}
                                  </span>
                                ))}
                              </div>
                              <h5>{purchase.product?.name || 'Unknown Product'}</h5>
                              <p>
                                {purchase.product?.category || 'Digital Product'}{" "}
                                <span className="buyer-dot">{"\u2022"}</span>{" "}
                                {purchase.product?.version || 'v1.0.0'}
                              </p>
                              {purchase.license_key && (
                                <div className="buyer-asset__license">
                                  <small>License: {purchase.license_key}</small>
                                </div>
                              )}
                              <button 
                                className="buyer-asset__download" 
                                type="button"
                                onClick={() => handleDownload(purchase.product?.id)}
                                disabled={!purchase.product?.id || downloading[purchase.product?.id]}
                              >
                                <img src={WhiteDownload} alt="" aria-hidden="true" />
                                {downloading[purchase.product?.id] ? 'Downloading...' : 'Download'}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>

                    {!searchQuery && purchases.length > 3 && (
                      <Link className="buyer-assets__link" to="/my-purchases">
                        View all assets <span aria-hidden="true">{"\u203a"}</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>

            <aside className="buyer-side">
              <div className="buyer-card buyer-activity">
                <div className="buyer-card__header">
                  <h4>Recent Activity</h4>
                  <button
                    className="buyer-iconBtn"
                    type="button"
                    aria-label="More"
                  >
                    ...
                  </button>
                </div>
                <ul className="buyer-activity__list">
                  {displayActivities.map((activity, index) => (
                    <li key={index} className="buyer-activity__item">
                      <div className="buyer-activity__icon">
                        <img src={activity.icon} alt="" aria-hidden="true" />
                      </div>
                      <div>
                        <p>{activity.title}</p>
                        <span>{activity.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                {/* <button className="buyer-activity__cta" type="button">
                  View Full History
                </button> */}
              </div>

              <div className="buyer-card buyer-support">
                <h4>Support</h4>
                <div className="buyer-support__list">
                  {supportItems.map((item) => (
                    <Link
                      key={item.title}
                      className="buyer-support__item"
                      to="/customer-support"
                    >
                      <span className="buyer-support__icon">
                        <img src={item.icon} alt="" aria-hidden="true" />
                      </span>
                      <span className="buyer-support__text">
                        <strong>{item.title}</strong>
                        <small>{item.desc}</small>
                      </span>
                      <span className="buyer-support__arrow" aria-hidden="true">
                        {"\u203a"}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="buyer-pro">
                <img
                  className="buyer-pro__icon"
                  src={OrangeStar}
                  alt=""
                  aria-hidden="true"
                />
                <div className="buyer-pro__tag">PRO PERK</div>
                <h5>Get early access to v3.0 of our UI components.</h5>
                <button className="buyer-pro__cta" type="button">
                  Join Beta
                </button>
                <img
                  className="buyer-pro__spark"
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

export default BuyerDashboard;
