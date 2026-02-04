import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import "../../styles/adminAddNewAssets.css";
import searchIcon from "../../assets/Search.png";
import notifBell from "../../assets/NotifBell.png";
import generalDetailsIcon from "../../assets/general-details-add-new-assets.png";
import technicalConfIcon from "../../assets/technicalconf.png";
import pricingIcon from "../../assets/pricing.png";
import mediaAssetsIcon from "../../assets/media-assets.png";
import uploadIcon from "../../assets/upload.png";

const AdminAddNewAssets = () => {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar activePage="inventory" />

      <main className="add-asset-main">
        {/* Topbar */}
        <AdminTopbar
          className="add-asset-topbar"
          searchIcon={<img src={searchIcon} alt="Search" className="search-icon" />}
        >
          <Link
            to="/admin-notification"
            className="notification-link"
            aria-label="Notifications"
          >
            <img src={notifBell} alt="Notifications" className="topbar-icon" />
            <span className="notification-dot" />
          </Link>
          <Link to="/inventory" className="btn primary">
            Back to Inventory
          </Link>
        </AdminTopbar>

        {/* Breadcrumb + Title */}
        <section className="add-asset-header">
          <nav className="breadcrumbs">
            <span className="crumb-link" onClick={() => navigate("/inventory")}>
              Inventory
            </span>
            <span className="crumb-separator">›</span>
            <span className="crumb-link">Add New Asset</span>
          </nav>

          <h1>Create New Digital Offering</h1>
          <p className="subtitle">
            Populate the details below to list a new digital product in the
            repository.
          </p>
        </section>

        {/* Scrollable content */}
        <section className="add-asset-content">
          {/* General Details */}
          <div className="card-block">
            <header className="card-header-row">
              <div className="card-title-icon orange-square">
                <img src={generalDetailsIcon} alt="General details" />
              </div>
              <div>
                <h2>General Details</h2>
                <p>Basic information about the asset.</p>
              </div>
            </header>

            <div className="card-body-grid two-col">
              <div className="form-group">
                <label>Asset Name</label>
                <input type="text" placeholder="e.g. Modern SaaS Dashboard" />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select>
                  <option>Website App</option>
                  <option>Mobile App</option>
                  <option>UI Kit</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Short Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the core features and purpose of the asset..."
                />
              </div>
            </div>
          </div>

          {/* Technical Configuration */}
          <div className="card-block">
            <header className="card-header-row">
              <div className="card-title-icon orange-square">
                <img src={technicalConfIcon} alt="Technical configuration" />
              </div>
              <div>
                <h2>Technical Configuration</h2>
                <p>Define the underlying tech stack and versioning.</p>
              </div>
            </header>

            <div className="card-body-grid two-col">
              <div className="form-group">
                <label>Tech Stack (Select Multiple)</label>
                <div className="tech-pill-row">
                  <span className="tech-pill blue">React.js</span>
                  <span className="tech-pill green">Node.js</span>
                  <span className="tech-pill purple">Tailwind</span>
                  <button type="button" className="tech-add">
                    + Add Tech
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Version Number</label>
                <input type="text" placeholder="e.g. 1.0.4" />
              </div>
            </div>
          </div>

          {/* Pricing & Licensing row */}
          <div className="pricing-grid">
            <div className="card-block">
              <header className="card-header-row">
                <div className="card-title-icon orange-square">
                  <img src={pricingIcon} alt="Pricing & Licensing" />
                </div>
                <div>
                  <h2>Pricing &amp; Licensing</h2>
                  <p>Set how the asset is priced.</p>
                </div>
              </header>

              <div className="card-body-grid single-col">
                <div className="form-group">
                  <label>Base Price (USD)</label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">$</span>
                    <input type="number" placeholder="0.00" />
                  </div>
                </div>

                <div className="flash-sale-row">
                  <div>
                    <div className="flash-sale-title">Enable Flash Sale</div>
                    <p className="field-hint">
                      Apply seasonal discount automatically.
                    </p>
                  </div>
                  <label className="switch large dark">
                    <input type="checkbox" defaultChecked />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>

            <div className="card-block">
              <header className="card-header-row">
                <div className="card-title-icon orange-square">
                  <img src={pricingIcon} alt="Pricing & Licensing" />
                </div>
                <div>
                  <h2>Pricing &amp; Licensing</h2>
                  <p>Source Code Package</p>
                </div>
              </header>

              <div className="upload-box">
                <div className="upload-dashed">
                  <p className="upload-title">Click to upload or drag .zip</p>
                  <p className="upload-sub">Maximum file size 500MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Media Assets */}
          <div className="card-block">
            <header className="card-header-row">
              <div className="card-title-icon orange-square">
                <img src={mediaAssetsIcon} alt="Media assets" />
              </div>
              <div>
                <h2>Media Assets</h2>
                <p>Upload thumbnails and gallery screenshots.</p>
              </div>
            </header>

            <div className="media-grid">
              <div className="media-column">
                <h3>Product Thumbnail</h3>
                <div className="media-upload-tile dashed">
                  <img
                    src={uploadIcon}
                    alt="Upload"
                    className="upload-icon-img"
                  />
                  <span className="upload-label">Upload</span>
                </div>
              </div>

              <div className="media-column">
                <h3>Gallery Screenshots</h3>
                <div className="media-gallery-row">
                  <div className="media-upload-tile filled one">1</div>
                  <div className="media-upload-tile filled two">2</div>
                  <div className="media-upload-tile dashed plus">+</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer status bar */}
        <footer className="add-asset-footer">
          <div className="footer-left">
            <span className="status-dot" />
            <span>All changes saved locally</span>
          </div>
          <div className="footer-middle">Saved as Draft</div>
          <button type="button" className="btn primary footer-cta">
            Publish to Repository
          </button>
        </footer>
      </main>
    </div>
  );
};

export default AdminAddNewAssets;
