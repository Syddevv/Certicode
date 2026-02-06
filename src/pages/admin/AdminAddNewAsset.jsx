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

  const techDropdownRef = useRef(null);
  const techSearchRef = useRef(null);

  const techOptions = ['React', 'Node.js', 'Vue.js', 'Angular', 'Laravel', 'Django', 'Flutter', 'React Native', 'Next.js', 'TypeScript', 'Python', 'PHP', 'MySQL', 'MongoDB', 'Firebase', 'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'HTML', 'CSS', 'JavaScript', 'Figma', 'Adobe XD', 'Tailwind', 'Swift', 'Stripe'];

  useEffect(() => {
    if (isEditMode && productData) {
      const existingTechs = Array.isArray(productData.technologies) 
        ? productData.technologies 
        : (productData.technologies ? JSON.parse(productData.technologies) : []);
      
      const existingImages = Array.isArray(productData.images) 
        ? productData.images 
        : (productData.images ? JSON.parse(productData.images) : []);
      
      const existingProjectFiles = Array.isArray(productData.project_files) 
        ? productData.project_files 
        : (productData.project_files ? JSON.parse(productData.project_files) : []);
      
      setExistingFiles(existingProjectFiles);
      
      const filePreviewsData = existingProjectFiles.map(file => ({
        name: file.name || file,
        size: file.size,
        type: file.mime_type || 'application/zip'
      }));
      
      setFormData({
        name: productData.name || "",
        asset_type: productData.asset_type || "",
        description: productData.description || "",
        technologies: existingTechs,
        version: productData.version || "1.0",
        price: productData.price || "",
      });
      
      setSelectedTechnologies(existingTechs);
      setFilePreviews(filePreviewsData);
      
      if (productData.featured_image) {
        setThumbnailPreview(productData.featured_image);
      }
      
      if (existingImages && existingImages.length > 0) {
        setGalleryPreviews(existingImages);
      }
    }
  }, [isEditMode, productData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (techDropdownRef.current && !techDropdownRef.current.contains(event.target)) {
        setShowTechDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (techSearch) {
      const filtered = techOptions.filter(tech => 
        tech.toLowerCase().includes(techSearch.toLowerCase()) && 
        !selectedTechnologies.includes(tech)
      );
      setFilteredTechs(filtered);
      setShowTechDropdown(true);
    } else {
      setFilteredTechs([]);
    }
  }, [techSearch, selectedTechnologies]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechSearch = (e) => {
    setTechSearch(e.target.value);
  };

  const handleTechSelect = (tech) => {
    if (!selectedTechnologies.includes(tech)) {
      const newTechs = [...selectedTechnologies, tech];
      setSelectedTechnologies(newTechs);
      setFormData(prev => ({
        ...prev,
        technologies: newTechs
      }));
      setTechSearch("");
      setShowTechDropdown(false);
    }
  };

  const handleTechRemove = (tech) => {
    const newTechs = selectedTechnologies.filter(t => t !== tech);
    setSelectedTechnologies(newTechs);
    setFormData(prev => ({
      ...prev,
      technologies: newTechs
    }));
  };

  const handleTechKeyDown = (e) => {
    if (e.key === 'Enter' && techSearch.trim()) {
      e.preventDefault();
      if (filteredTechs.length > 0) {
        handleTechSelect(filteredTechs[0]);
      } else if (!selectedTechnologies.includes(techSearch.trim())) {
        const newTechs = [...selectedTechnologies, techSearch.trim()];
        setSelectedTechnologies(newTechs);
        setFormData(prev => ({
          ...prev,
          technologies: newTechs
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
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews([...galleryPreviews, ...previews]);
    setGalleryFiles([...galleryFiles, ...files]);
  };

  const removeGalleryImage = (index) => {
    const newPreviews = [...galleryPreviews];
    const removedPreview = newPreviews.splice(index, 1);
    setGalleryPreviews(newPreviews);
    
    const newFiles = [...galleryFiles];
    const removedFile = newFiles.splice(index, 1);
    setGalleryFiles(newFiles);
    
    if (removedPreview[0]?.startsWith('blob:')) {
      URL.revokeObjectURL(removedPreview[0]);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setFilePreviews([...filePreviews, ...previews]);
    setProjectFiles([...projectFiles, ...files]);
  };

  const removeFile = (index) => {
    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
    
    const newFiles = [...projectFiles];
    newFiles.splice(index, 1);
    setProjectFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveStatus("");
    
    if (!isEditMode && !thumbnailFile) {
      setSaveStatus("Error: Featured image is required");
      setLoading(false);
      return;
    }
    
    if (!formData.name || !formData.asset_type || !formData.price) {
      setSaveStatus("Error: Please fill in all required fields");
      setLoading(false);
      return;
    }
    
    try {
      const submitData = new FormData();
      
      submitData.append('name', formData.name);
      submitData.append('asset_type', formData.asset_type);
      submitData.append('description', formData.description || '');
      submitData.append('version', formData.version || '1.0');
      submitData.append('price', parseFloat(formData.price) || 0);
      
      selectedTechnologies.forEach((tech, index) => {
        submitData.append(`technologies[${index}]`, tech);
      });
      
      if (thumbnailFile) {
        submitData.append('featured_image', thumbnailFile);
      }
      
      galleryFiles.forEach((file, index) => {
        submitData.append(`images[${index}]`, file);
      });
      
      projectFiles.forEach((file, index) => {
        submitData.append(`project_files[${index}]`, file);
      });
      
      if (isEditMode && productData?.id) {
        if (galleryPreviews.length > 0) {
          const existingGalleryUrls = galleryPreviews.filter(preview => !preview.startsWith('blob:'));
          if (existingGalleryUrls.length > 0) {
            submitData.append('images', JSON.stringify(existingGalleryUrls));
          }
        }
        
        if (existingFiles.length > 0) {
          submitData.append('project_files', JSON.stringify(existingFiles));
        }
      }
      
      const token = localStorage.getItem('auth_token');
      
      let url = 'http://127.0.0.1:8000/api/products';
      let method = 'POST';
      
      if (isEditMode && productData?.id) {
        url = `http://127.0.0.1:8000/api/products/${productData.id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: submitData
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText };
        }
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
      
      const result = JSON.parse(responseText);
      setSaveStatus(result.message || `Product ${isEditMode ? 'updated' : 'created'} successfully!`);
      setTimeout(() => navigate("/inventory"), 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      setSaveStatus(`Error: ${error.message}`);
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
              {isEditMode ? 'Edit Asset' : 'Add New Asset'}
            </span>
          </nav>

          <h1>{isEditMode ? 'Edit Digital Asset' : 'Create New Digital Offering'}</h1>
          <p className="subtitle">
            {isEditMode 
              ? 'Update the details of this digital product in the repository.'
              : 'Populate the details below to list a new digital product in the repository.'
            }
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
                  <label>Asset Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="e.g. Modern SaaS Dashboard" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select 
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
                  <label>Description</label>
                  <textarea
                    name="description"
                    rows={5}
                    placeholder="Describe the core features and purpose of the asset..."
                    value={formData.description}
                    onChange={handleInputChange}
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
                  <label>Tech Stack</label>
                  <div className="tech-input-container" ref={techDropdownRef}>
                    <div className="tech-search-wrapper">
                      <input
                        ref={techSearchRef}
                        type="text"
                        placeholder="Type to search or add technology..."
                        value={techSearch}
                        onChange={handleTechSearch}
                        onKeyDown={handleTechKeyDown}
                        onFocus={() => techSearch && setShowTechDropdown(true)}
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
                  <label>Version Number</label>
                  <input 
                    type="text" 
                    name="version"
                    placeholder="e.g. 1.0.4" 
                    value={formData.version}
                    onChange={handleInputChange}
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
                    <label>Base Price (USD) *</label>
                    <div className="input-with-prefix">
                      <span className="input-prefix">$</span>
                      <input 
                        type="number" 
                        name="price"
                        placeholder="0.00" 
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
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
                    onClick={() => document.getElementById('file-upload').click()}
                    style={{ cursor: 'pointer' }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload" className="upload-label">
                      <p className="upload-title">Click to upload or drag .zip</p>
                      <p className="upload-sub">Maximum file size 500MB</p>
                    </label>
                  </div>
                  {filePreviews.length > 0 && (
                    <div className="uploaded-files-list">
                      {filePreviews.map((file, index) => (
                        <div key={index} className="file-preview">
                          <span>{file.name}</span>
                          <button
                            type="button"
                            className="remove-file-btn"
                            onClick={() => removeFile(index)}
                            style={{ cursor: 'pointer' }}
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
                  <h3>Product Thumbnail (Featured Image) *</h3>
                  <div className="thumbnail-upload">
                    {thumbnailPreview ? (
                      <div className="thumbnail-preview">
                        <img src={thumbnailPreview} alt="Thumbnail preview" />
                        <div className="thumbnail-actions">
                          <input
                            type="file"
                            id="change-thumbnail"
                            accept="image/*"
                            onChange={handleThumbnailUpload}
                            style={{ display: 'none' }}
                          />
                          <label 
                            htmlFor="change-thumbnail" 
                            className="change-thumbnail-btn"
                            style={{ cursor: 'pointer' }}
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            className="remove-thumbnail-btn"
                            onClick={() => {
                              setThumbnailPreview("");
                              setThumbnailFile(null);
                              if (thumbnailPreview.startsWith('blob:')) {
                                URL.revokeObjectURL(thumbnailPreview);
                              }
                            }}
                            style={{ marginLeft: '8px', cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="thumbnail-upload-placeholder"
                        onClick={() => document.getElementById('thumbnail-upload').click()}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          type="file"
                          id="thumbnail-upload"
                          accept="image/*"
                          onChange={handleThumbnailUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="thumbnail-upload" className="upload-placeholder">
                          <img src={uploadIcon} alt="Upload" />
                          <span>Click to upload thumbnail</span>
                          <small>Required • Recommended: 800×600px</small>
                        </label>
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
                            style={{ cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <div 
                        className="gallery-add-item"
                        onClick={() => document.getElementById('gallery-upload').click()}
                        style={{ cursor: 'pointer' }}
                      >
                        <input
                          type="file"
                          id="gallery-upload"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="gallery-upload" className="gallery-add-placeholder">
                          <span>+</span>
                          <small>Add Images</small>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="add-asset-footer">
            <div className="footer-left">
              {saveStatus && <span className={`status-message ${saveStatus.includes('Error') ? 'error' : 'success'}`}>{saveStatus}</span>}
            </div>
            <button 
              type="button" 
              className="btn secondary"
              onClick={() => navigate("/inventory")}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn primary footer-cta"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Asset' : 'Publish to Repository'}
            </button>
          </footer>
        </form>
      </main>
    </div>
  );
};

export default AdminAddNewAssets;