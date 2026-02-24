import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import greenCheckIcon from "../../assets/greenCheck.png";
import { AdminInventoryAPI } from "../../services/AdminInventoryAPI";

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

const AdminAddNewAssets = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.state?.editMode || false;
  const productData = location.state?.productData || null;

  const [formData, setFormData] = useState({
    name: "",
    asset_type: "",
    description: "",
    technologies: [],
    version: "1.0",
    price: "",
  });

  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [techSearch, setTechSearch] = useState("");
  const [filteredTechs, setFilteredTechs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showTechDropdown, setShowTechDropdown] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [projectFiles, setProjectFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const techDropdownRef = useRef(null);
  const techSearchRef = useRef(null);

  const techOptions = [
    "React",
    "Node.js",
    "Vue.js",
    "Angular",
    "Laravel",
    "Django",
    "Flutter",
    "React Native",
    "Next.js",
    "TypeScript",
    "Python",
    "PHP",
    "MySQL",
    "MongoDB",
    "Firebase",
    "AWS",
    "Docker",
    "Kubernetes",
    "GraphQL",
    "REST API",
    "HTML",
    "CSS",
    "JavaScript",
    "Figma",
    "Adobe XD",
    "Tailwind",
    "Swift",
    "Stripe",
  ];

  useEffect(() => {
    if (isEditMode && productData) {
      let techs = [];
      if (productData.technologies) {
        if (Array.isArray(productData.technologies)) {
          techs = productData.technologies;
        } else if (typeof productData.technologies === "string") {
          try {
            techs = JSON.parse(productData.technologies) || [];
          } catch {
            techs = [];
          }
        }
      }

      let images = [];
      if (productData.images) {
        if (Array.isArray(productData.images)) {
          images = productData.images;
        } else if (typeof productData.images === "string") {
          try {
            images = JSON.parse(productData.images) || [];
          } catch {
            images = [];
          }
        }
      }

      let files = [];
      if (productData.project_files) {
        if (Array.isArray(productData.project_files)) {
          files = productData.project_files;
        } else if (typeof productData.project_files === "string") {
          try {
            files = JSON.parse(productData.project_files) || [];
          } catch {
            files = [];
          }
        }
      }

      setExistingFiles(files);
      setExistingImages(images);

      const filePreviewsData = files.map((file) => {
        if (typeof file === "string") {
          return {
            name: file.split("/").pop() || "file.zip",
            size: 0,
            type: "application/zip",
            isExisting: true,
            url: file,
          };
        }
        return {
          name: file.name || file.filename || "file.zip",
          size: file.size || 0,
          type: file.type || file.mime_type || "application/zip",
          isExisting: true,
          url: file.url || file.path || file,
        };
      });

      setFormData({
        name: productData.name || "",
        asset_type: productData.asset_type || "",
        description: productData.description || "",
        technologies: techs,
        version: productData.version || "1.0",
        price: productData.price || "",
      });

      setSelectedTechnologies(techs);
      setFilePreviews(filePreviewsData);

      if (productData.featured_image) {
        setThumbnailPreview(productData.featured_image);
      }

      if (images && images.length > 0) {
        setGalleryPreviews(images);
      }
    }
  }, [isEditMode, productData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        techDropdownRef.current &&
        !techDropdownRef.current.contains(event.target)
      ) {
        setShowTechDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (techSearch) {
      const filtered = techOptions.filter(
        (tech) =>
          tech.toLowerCase().includes(techSearch.toLowerCase()) &&
          !selectedTechnologies.includes(tech),
      );
      setFilteredTechs(filtered);
      setShowTechDropdown(true);
    } else {
      setFilteredTechs([]);
    }
  }, [techSearch, selectedTechnologies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTechSearch = (e) => {
    setTechSearch(e.target.value);
  };

  const handleTechSelect = (tech) => {
    if (!selectedTechnologies.includes(tech)) {
      const newTechs = [...selectedTechnologies, tech];
      setSelectedTechnologies(newTechs);
      setFormData((prev) => ({
        ...prev,
        technologies: newTechs,
      }));
      setTechSearch("");
      setShowTechDropdown(false);
    }
  };

  const handleTechRemove = (tech) => {
    const newTechs = selectedTechnologies.filter((t) => t !== tech);
    setSelectedTechnologies(newTechs);
    setFormData((prev) => ({
      ...prev,
      technologies: newTechs,
    }));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === "Enter" && techSearch.trim()) {
      e.preventDefault();
      if (filteredTechs.length > 0) {
        handleTechSelect(filteredTechs[0]);
      } else if (!selectedTechnologies.includes(techSearch.trim())) {
        const newTechs = [...selectedTechnologies, techSearch.trim()];
        setSelectedTechnologies(newTechs);
        setFormData((prev) => ({
          ...prev,
          technologies: newTechs,
        }));
        setTechSearch("");
      }
    }
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setThumbnailPreview(preview);
      setThumbnailFile(file);
    }
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews([...galleryPreviews, ...previews]);
    setGalleryFiles([...galleryFiles, ...files]);
  };

  const removeGalleryImage = (index) => {
    const newPreviews = [...galleryPreviews];
    const removedPreview = newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);

    const newFiles = [...galleryFiles];
    newFiles.splice(index, 1);
    setGalleryFiles(newFiles);

    if (removedPreview[0]?.startsWith("blob:")) {
      URL.revokeObjectURL(removedPreview[0]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      isExisting: false,
      file: file,
    }));
    setFilePreviews([...filePreviews, ...previews]);
    setProjectFiles([...projectFiles, ...files]);
  };

  const removeFile = (index) => {
    const fileToRemove = filePreviews[index];
    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);

    if (!fileToRemove.isExisting) {
      const newFiles = [...projectFiles];
      const fileIndex = newFiles.findIndex((f) => f.name === fileToRemove.name);
      if (fileIndex !== -1) {
        newFiles.splice(fileIndex, 1);
        setProjectFiles(newFiles);
      }
    } else {
      setExistingFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleThumbnailButtonClick = () => {
    document.getElementById("thumbnail-upload").click();
  };

  const handleGalleryButtonClick = () => {
    document.getElementById("gallery-upload").click();
  };

  const handleFileButtonClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleChangeThumbnailClick = () => {
    document.getElementById("change-thumbnail").click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus("");

    if (!formData.name || !formData.asset_type || !formData.price) {
      setSaveStatus("Error: Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const existingImageUrls = galleryPreviews.filter(
        (preview) => !preview.startsWith("blob:"),
      );
      const existingFileUrls = filePreviews
        .filter((file) => file.isExisting)
        .map((file) => file.url);

      const productDataForAPI = {
        name: formData.name,
        asset_type: formData.asset_type,
        description: formData.description || "",
        version: formData.version || "1.0",
        price: parseFloat(formData.price),
        technologies: JSON.stringify(selectedTechnologies), // Stringify here
      };

      if (isEditMode && productData?.id) {
        productDataForAPI.existing_images = existingImageUrls;
        productDataForAPI.existing_project_files = existingFileUrls;

        if (thumbnailFile) {
          productDataForAPI.featured_image = thumbnailFile;
        } else if (thumbnailPreview && !thumbnailFile) {
          productDataForAPI.existing_featured_image = thumbnailPreview;
        }

        if (galleryFiles.length > 0) {
          productDataForAPI.images = galleryFiles;
        }

        if (projectFiles.length > 0) {
          productDataForAPI.project_files = projectFiles;
        }

        const result = await AdminInventoryAPI.updateProduct(
          productData.id,
          productDataForAPI,
        );
        setSaveStatus(result.message || "Product updated successfully!");
      } else {
        if (!thumbnailFile) {
          setSaveStatus("Error: Featured image is required for new products");
          setLoading(false);
          return;
        }

        productDataForAPI.featured_image = thumbnailFile;

        if (galleryFiles.length > 0) {
          productDataForAPI.images = galleryFiles;
        }

        if (projectFiles.length > 0) {
          productDataForAPI.project_files = projectFiles;
        }

        const result = await AdminInventoryAPI.createProduct(productDataForAPI);
        setSaveStatus(result.message || "Product created successfully!");
      }

      setTimeout(() => navigate("/inventory"), 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setSaveStatus(`Error: ${error.message || "Failed to save product"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar activePage="inventory" />

      <main className="add-asset-main">
        <AdminTopbar
          className="add-asset-topbar"
          searchIcon={
            <img src={searchIcon} alt="Search" className="search-icon" />
          }
        >
          <Link
            to="/admin-notification"
            className="notification-link"
            aria-label="Notifications"
          >
            <img src={notifBell} alt="Notifications" className="topbar-icon" />
            <span className="notification-dot" />
          </Link>
          <button
            onClick={() => navigate("/inventory")}
            className="btn primary"
          >
            Back to Inventory
          </button>
        </AdminTopbar>

        <section className="add-asset-header">
          <nav className="breadcrumbs">
            <span className="crumb-link" onClick={() => navigate("/inventory")}>
              Inventory
            </span>
            <span className="crumb-separator">›</span>
            <span className="crumb-link">
              {isEditMode ? "Edit Asset" : "Add New Asset"}
            </span>
          </nav>

          <h1>
            {isEditMode ? "Edit Digital Asset" : "Create New Digital Offering"}
          </h1>
          <p className="subtitle">
            {isEditMode
              ? "Update the details of this digital product in the repository."
              : "Populate the details below to list a new digital product in the repository."}
          </p>
        </section>

        <form onSubmit={handleSubmit}>
          <section className="add-asset-content">
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
                  <label htmlFor="asset-name">Asset Name *</label>
                  <input
                    type="text"
                    id="asset-name"
                    name="name"
                    placeholder="e.g. Modern SaaS Dashboard"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="asset-category">Category *</label>
                  <select
                    id="asset-category"
                    name="asset_type"
                    value={formData.asset_type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Website">Website App</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="UI Kit">UI Kit</option>
                    <option value="Custom Projects">Custom Projects</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="asset-description">Description</label>
                  <textarea
                    id="asset-description"
                    name="description"
                    rows={5}
                    placeholder="Describe the core features and purpose of the asset..."
                    value={formData.description}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

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
                  <label htmlFor="tech-search">Tech Stack</label>
                  <div className="tech-input-container" ref={techDropdownRef}>
                    <div className="tech-search-wrapper">
                      <input
                        ref={techSearchRef}
                        id="tech-search"
                        type="text"
                        placeholder="Type to search or add technology..."
                        value={techSearch}
                        onChange={handleTechSearch}
                        onKeyDown={handleTechKeyDown}
                        onFocus={() => techSearch && setShowTechDropdown(true)}
                        autoComplete="off"
                      />
                      {showTechDropdown && filteredTechs.length > 0 && (
                        <div className="tech-dropdown">
                          {filteredTechs.map((tech, index) => (
                            <div
                              key={index}
                              className="tech-dropdown-item"
                              onClick={() => handleTechSelect(tech)}
                            >
                              {tech}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="selected-tech-tags">
                      {selectedTechnologies.map((tech, index) => (
                        <span
                          key={index}
                          className={`selected-tech-tag tech-tag--${getToneColor(tech)}`}
                        >
                          {tech}
                          <button
                            type="button"
                            className="remove-tech-btn"
                            onClick={() => handleTechRemove(tech)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="asset-version">Version Number</label>
                  <input
                    type="text"
                    id="asset-version"
                    name="version"
                    placeholder="e.g. 1.0.4"
                    value={formData.version}
                    onChange={handleInputChange}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

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
                    <label htmlFor="asset-price">Base Price (USD) *</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">$</span>
                      <input
                        type="number"
                        id="asset-price"
                        name="price"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-block">
                <header className="card-header-row">
                  <div className="card-title-icon orange-square">
                    <img src={pricingIcon} alt="Pricing & Licensing" />
                  </div>
                  <div>
                    <h2>Source Code Package</h2>
                    <p>Upload project files</p>
                  </div>
                </header>

                <div className="upload-box">
                  <div
                    className="upload-dashed"
                    onClick={handleFileButtonClick}
                    style={{ cursor: "pointer" }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      name="project_files"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <div className="upload-label">
                      <p className="upload-title">
                        Click to upload or drag .zip
                      </p>
                      <p className="upload-sub">Maximum file size 500MB</p>
                    </div>
                  </div>
                  {filePreviews.length > 0 && (
                    <div className="uploaded-files-list">
                      {filePreviews.map((file, index) => (
                        <div key={index} className="file-preview">
                          <span>
                            {file.name} {file.isExisting && "(Existing)"}
                          </span>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => removeFile(index)}
                            style={{ cursor: "pointer" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                  <h3>
                    Product Thumbnail (Featured Image) {!isEditMode && "*"}
                  </h3>
                  <div className="thumbnail-upload">
                    {thumbnailPreview ? (
                      <div className="thumbnail-preview">
                        <img src={thumbnailPreview} alt="Thumbnail preview" />
                        <div className="thumbnail-actions">
                          <input
                            type="file"
                            id="change-thumbnail"
                            name="featured_image"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            style={{ display: "none" }}
                          />
                          <button
                            type="button"
                            className="change-thumbnail-btn"
                            onClick={handleChangeThumbnailClick}
                            style={{ cursor: "pointer" }}
                          >
                            Change
                          </button>
                          <button
                            type="button"
                            className="remove-thumbnail-btn"
                            onClick={() => {
                              setThumbnailPreview("");
                              setThumbnailFile(null);
                              if (thumbnailPreview.startsWith("blob:")) {
                                URL.revokeObjectURL(thumbnailPreview);
                              }
                            }}
                            style={{ marginLeft: "8px", cursor: "pointer" }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="thumbnail-upload-placeholder"
                        onClick={handleThumbnailButtonClick}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="file"
                          id="thumbnail-upload"
                          name="featured_image"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          style={{ display: "none" }}
                        />
                        <div className="upload-placeholder">
                          <img src={uploadIcon} alt="Upload" />
                          <span>Click to upload thumbnail</span>
                          <small>Required • Recommended: 800×600px</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="media-column">
                  <h3>Gallery Screenshots ({galleryPreviews.length})</h3>
                  <div className="gallery-upload">
                    <div className="gallery-grid">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="gallery-item">
                          <img src={preview} alt={`Gallery ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-gallery-btn"
                            onClick={() => removeGalleryImage(index)}
                            style={{ cursor: "pointer" }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div
                        className="gallery-add-item"
                        onClick={handleGalleryButtonClick}
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="file"
                          id="gallery-upload"
                          name="gallery_images"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          style={{ display: "none" }}
                        />
                        <div className="gallery-add-placeholder">
                          <span>+</span>
                          <small>Add Images</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="add-asset-footer">
            <div className="footer-left">
              <div className="footer-local-status" aria-live="polite">
                <img
                  src={greenCheckIcon}
                  alt=""
                  aria-hidden="true"
                  className="footer-local-status__icon"
                />
                <span>All changes saved locally</span>
              </div>
              {saveStatus && (
                <span
                  className={`status-message ${saveStatus.includes("Error") ? "error" : "success"}`}
                >
                  {saveStatus}
                </span>
              )}
            </div>
            <div className="footer-actions">
              <span className="footer-draft-label">Saved as Draft</span>
              <button
                type="submit"
                className="btn primary footer-cta"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : isEditMode
                    ? "Update Asset"
                    : "Publish to Repository"}
              </button>
            </div>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default AdminAddNewAssets;
