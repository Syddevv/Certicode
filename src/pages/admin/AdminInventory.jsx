import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/adminInventory.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import webappsIcon from "../../assets/webapps.png";
import mobileIcon from "../../assets/mobile.png";
import notifBell from "../../assets/NotifBell.png";
import uiUxIcon from "../../assets/ui-ux.png";
import settingsCustomIcon from "../../assets/settings-custom.png";
import newSaleIcon from "../../assets/new-sale-e-commerce.png";
import assetUpdatedIcon from "../../assets/asset-updated.png";
import fintechIcon from "../../assets/fintech-banking.png";
import developerIcon from "../../assets/developer-portfolio.png";
import fitlifeIcon from "../../assets/fitlife-tracker.png";
import totalValueIcon from "../../assets/total-value.png";
import lastAuditIcon from "../../assets/last-audit.png";
import { AdminInventoryAPI } from "../../services/AdminInventoryAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const Icons = {
  Bell: "🔔",
  Add: "+",
  More: "⋮",
  Filter: "⚙️",
  Edit: "📝",
  Trash: "🗑️",
  Settings: "⚙️",
  Web: "🌐",
  Mobile: "📱",
  Design: "🎨",
  Value: "💰",
  Sales: "🛒",
  Audit: "⏱️"
};

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    total_value: 0,
    monthly_sales: 0,
    last_audit: "",
    active_count: 0,
    draft_count: 0,
    archived_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [filters, setFilters] = useState({
    category: "all",
    search: ""
  });
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  const fetchStats = useCallback(async () => {
    try {
      const data = await AdminInventoryAPI.getInventoryStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AdminInventoryAPI.getProducts(currentPage, filters);
      setProducts(data.products);
      setTotalPages(data.pagination?.total_pages || 1);
      setTotalItems(data.pagination?.total_items || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (term) => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: term }));
      setCurrentPage(1);
    }, 300);

    setSearchTimeout(timeout);
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({ ...prev, category }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleEdit = (product) => {
    const productDataForEdit = {
      ...product,
      description: product.description || "",
      technologies: Array.isArray(product.technologies) 
        ? product.technologies 
        : (product.technologies ? JSON.parse(product.technologies) : []),
      images: Array.isArray(product.images) 
        ? product.images 
        : (product.images ? JSON.parse(product.images) : []),
      project_files: Array.isArray(product.project_files) 
        ? product.project_files 
        : (product.project_files ? JSON.parse(product.project_files) : [])
    };
    
    navigate("/add-asset", { 
      state: { 
        editMode: true,
        productData: productDataForEdit
      } 
    });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    
    setDeletingId(productId);
    try {
      await AdminInventoryAPI.deleteProduct(productId);
      await fetchProducts();
      await fetchStats();
      showSuccessToast("Asset deleted successfully.");
    } catch (error) {
      console.error("Error deleting product:", error);
      showErrorToast("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryBadge = (assetType) => {
    const badgeMap = {
      'website': 'gray',
      'web app': 'gray', 
      'mobile app': 'gray',
      'ui kit': 'gray',
      'ui/ux kits': 'gray',
      'desktop app': 'gray',
      'custom projects': 'gray'
    };
    
    const badgeClass = badgeMap[assetType?.toLowerCase()] || 'gray';
    
    return (
      <span className={`badge ${badgeClass}`}>
        {assetType?.toUpperCase() || 'UNCATEGORIZED'}
      </span>
    );
  };

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

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="pagination-controls">
        <button 
          className="page-btn" 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>
        {startPage > 1 && (
          <>
            <button 
              className="page-btn" 
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="dots">...</span>}
          </>
        )}
        {pages}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="dots">...</span>}
            <button 
              className="page-btn" 
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button 
          className="page-btn" 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
      </div>
    );
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      'all': 'All Assets',
      'Website': 'Web Apps',
      'Mobile App': 'Mobile Apps',
      'UI Kit': 'UI/UX Kits',
      'Custom Projects': 'Custom Projects'
    };
    return categoryMap[category] || category;
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="inventory" />

        <main className="main">
          <AdminTopbar showHamburger onSearch={handleSearch}>
            <Link to="/admin-notification" className="notification-link" aria-label="Notifications">
              <img src={notifBell} alt="Notifications" className="notification-icon" />
              <span className="notification-dot" />
            </Link>
            <Link to="/add-asset" className="btn primary">
              {Icons.Add} Add New Asset
            </Link>
          </AdminTopbar>

          <div className="page-header">
            <div>
              <h2>Admin Inventory Management</h2>
              <p className="subtitle">
                Track and manage all digital offerings from CertiCode repository.
              </p>
            </div>

            <div className="status-tabs">
              <button className="status-tab active">
                Active ({stats.active_count || 0})
              </button>
              <button className="status-tab">
                Drafts ({stats.draft_count || 0})
              </button>
              <button className="status-tab">
                Archived ({stats.archived_count || 0})
              </button>
            </div>
          </div>

          <div className="filter-bar">
            <div className="filter-group">
              <button 
                className={`filter-pill ${filters.category === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                All Assets
              </button>
              <button 
                className={`filter-pill ${filters.category === 'Website' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Website')}
              >
                <span>
                  <img src={webappsIcon} alt="Web Apps" className="filter-icon" />
                </span> {getCategoryName('Website')}
              </button>
              <button 
                className={`filter-pill ${filters.category === 'Mobile App' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Mobile App')}
              >
                <span>
                  <img src={mobileIcon} alt="Mobile Apps" className="filter-icon" />
                </span> {getCategoryName('Mobile App')}
              </button>
              <button 
                className={`filter-pill ${filters.category === 'UI Kit' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('UI Kit')}
              >
                <span>
                  <img src={uiUxIcon} alt="UI/UX Kits" className="filter-icon" />
                </span> {getCategoryName('UI Kit')}
              </button>
              <button 
                className={`filter-pill ${filters.category === 'Custom Projects' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('Custom Projects')}
              >
                <span>
                  <img src={settingsCustomIcon} alt="Custom Projects" className="filter-icon" />
                </span> {getCategoryName('Custom Projects')}
              </button>
            </div>

          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Asset Name</th>
                  <th style={{ width: "12%" }}>Category</th>
                  <th style={{ width: "20%" }}>Tech Stack</th>
                  <th style={{ width: "12%" }}>Price</th>
                  <th style={{ width: "12%" }}>Status</th>
                  <th style={{ width: "10%", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="loading-cell">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data-cell">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="asset-cell">
                          {product.featured_image ? (
                            <div className="asset-icon">
                              <img 
                                src={product.featured_image} 
                                alt={product.name} 
                                className="asset-icon-img"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = newSaleIcon;
                                }}
                              />
                            </div>
                          ) : (
                            <div className="asset-icon blue">
                              <img src={newSaleIcon} alt={product.name} className="asset-icon-img" />
                            </div>
                          )}
                          <div>
                            <strong>{product.name}</strong>
                            <small>Updated {product.updated_ago}</small>
                          </div>
                        </div>
                      </td>
                      <td>{getCategoryBadge(product.asset_type)}</td>
                      <td className="tech-stack">
                        <div className="tech-tags">
                          {product.technologies?.slice(0, 3).map((tech, index) => (
                            <span
                              key={index}
                              className={`tech-tag tech-tag--${getToneColor(tech)}`}
                            >
                              {tech}
                            </span>
                          ))}
                          {product.technologies?.length > 3 && <span className="tech-more">...</span>}
                        </div>
                      </td>
                      <td className="price">{formatCurrency(product.price)}</td>
                      <td>
                        <div className="status-indicator active">
                          <span className="dot"></span> ACTIVE
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleEdit(product)}
                            title="Edit"
                            disabled={deletingId === product.id}
                          >
                            {Icons.Settings}
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            title="Delete"
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? "..." : Icons.Trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination-bar">
              <span>
                Showing <strong>{((currentPage - 1) * 5) + 1}-{Math.min(currentPage * 5, totalItems)}</strong> of {totalItems} assets
              </span>
              {renderPagination()}
            </div>
          </div>

          <div className="bottom-stats">
            <div className="stat-card">
              <div className="stat-icon-circle orange">
                <img src={totalValueIcon} alt="Total Value" className="stat-icon-img" />
              </div>
              <div>
                <small>TOTAL VALUE</small>
                <h3>{formatCurrency(stats.total_value)}</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-circle green">
                <img src={assetUpdatedIcon} alt="Monthly Sales" className="stat-icon-img" />
              </div>
              <div>
                <small>MONTHLY SALES</small>
                <h3>{stats.monthly_sales} Items</h3>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-circle blue">
                <img src={lastAuditIcon} alt="Last Audit" className="stat-icon-img" />
              </div>
              <div>
                <small>LAST AUDIT</small>
                <h3>{stats.last_audit}</h3>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminInventory;
