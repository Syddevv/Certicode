import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/ProductDetails.css";
import CerticodeBoxIcon from "../../assets/CerticodeBoxIcon.png";
import Cart from "../../assets/Cart.png";
import VerifiedIcon from "../../assets/Verified.png";
import CustomerSupportIcon from "../../assets/CustomerSupport.png";
import UpdatesIcon from "../../assets/Updates.png";
import LicensedIcon from "../../assets/Licensed.png";
import CartIcon from "../../assets/cartt.png";
import MailIcon from "../../assets/tabler_mail-filled.png";
import ProductOverview from "../../components/ProductOverview";
import ProductTechStack from "../../components/ProductTechStack";
import ProductFeatures from "../../components/ProductFeatures";
import ProductReviews from "../../components/ProductReviews";
import { api } from "../../services/api";
import { CartAPI } from "../../services/CartAPI";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    
    const fromRelated = location.state?.fromRelated;
    const shouldUseState = location.state?.product && !fromRelated;
    
    if (shouldUseState) {
      handleProductFromState(location.state.product);
    } else {
      fetchProductDetails();
    }
  }, [id, location.state]);

  const handleProductFromState = async (productFromState) => {
    const count = await fetchReviewsCount(productFromState.id);
    
    const mappedProduct = {
      id: productFromState.id,
      name: productFromState.title,
      description: productFromState.description,
      price: productFromState.price,
      currency: "USD",
      asset_type: productFromState.asset_type,
      released_date: "Oct 12, 2023",
      last_update: "1 day ago",
      file_size: "42.5 MB",
      rating: productFromState.rating || "4.8",
      technologies: productFromState.technologies,
      features: productFromState.features,
      specifications: [],
      image_urls: productFromState.image_urls,
      vendor: "CertiCode",
      verified: true,
      includes_support: true,
      includes_updates: true,
      commercial_license: true,
      reviews_count: count,
    };
    
    setProduct(mappedProduct);
    setLoading(false);
    
    fetchProductDetails();
  };

  const fetchReviewsCount = async (productId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${productId}/reviews`);
      if (response.ok) {
        const reviews = await response.json();
        return reviews.length;
      }
      return 0;
    } catch (error) {
      console.error("Error fetching reviews count:", error);
      return 0;
    }
  };

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      const result = await api.getProductById(id);
      const productData = result.data || result;
      
      if (!productData) {
        setProduct(null);
        setLoading(false);
        return;
      }
      
      const reviewsCount = await fetchReviewsCount(productData.id);

      function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { year: "numeric", month: "short", day: "numeric" };
        return date.toLocaleDateString("en-US", options);
      }

      function timeSince(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "1 day ago";
        return `${diffDays} days ago`;
      }
      
      const calculateFileSize = () => {
        if (!productData.project_files || !Array.isArray(productData.project_files)) {
          return "0 MB";
        }
        
        let totalSize = 0;
        productData.project_files.forEach(file => {
          if (file && typeof file === 'object') {
            totalSize += file.size || 0;
          }
        });
        
        if (totalSize === 0) return "0 MB";
        
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = totalSize;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
          size /= 1024;
          unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
      };
      
      const apiProduct = {
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        currency: "USD",
        asset_type: productData.asset_type,
        released_date: formatDate(productData.created_at),
        last_update: timeSince(productData.updated_at),
        file_size: calculateFileSize(),
        rating: "4.8",
        technologies: productData.technologies,
        features: productData.features,
        specifications: [],
        featured_image: productData.featured_image,
        images: productData.images || [],
        project_files: productData.project_files || [],
        vendor: "CertiCode",
        verified: true,
        includes_support: true,
        includes_updates: true,
        commercial_license: true,
        reviews_count: reviewsCount,
      };
      
      setProduct(apiProduct);
      
      if (apiProduct.asset_type) {
        try {
          const relatedResult = await api.getProducts("", apiProduct.asset_type, 1);
          const related = relatedResult.data
            .filter(item => item.id !== apiProduct.id)
            .slice(0, 4)
            .map(item => ({
              id: item.id,
              name: item.name,
              title: item.name,
              description: item.description,
              price: item.price,
              rating: "4.2",
              vendor: "CertiCode",
              asset_type: item.asset_type,
              technologies: item.technologies || [],
              features: item.features || [],
              featured_image: item.featured_image,
              images: item.images || []
            }));
          setRelatedProducts(related);
        } catch (error) {
          console.error("Error fetching related products:", error);
        }
      }
      
    } catch (error) {
      console.error("Error fetching from API:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
  e.preventDefault();
  
  if (!product || !product.id) {
    setCartMessage("Product information is missing");
    return;
  }

  const token = localStorage.getItem('auth_token');
    if (!token) {
      setCartMessage("Please login to add items to cart");
      
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            from: `/marketplace/${product.id}`,
            message: "Please login to add items to your cart" 
          } 
        });
      }, 1500);
      return;
    }

    try {
      setAddingToCart(true);
      setCartMessage("");
      
      const response = await CartAPI.addToCart(product.id);
      
      if (response && (response.message === "Product added to cart" || response.message === "Product already in cart")) {
        navigate("/cart");
      } else {
        setCartMessage("Failed to add to cart. Please try again.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      
      if (error.response && error.response.status === 401) {
        setCartMessage("Session expired. Please login again.");
        localStorage.removeItem('auth_token');
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } 
      else if (error.response && error.response.status === 400) {
        navigate("/cart");
      }
      else {
        setCartMessage(error.message || "Failed to add to cart. Please try again.");
      }
    } finally {
      setAddingToCart(false);
      
      setTimeout(() => {
        setCartMessage("");
      }, 3000);
    }
  };

  const getAllImages = () => {
    if (!product) return [];
    const images = [];
    if (product.featured_image) {
      images.push(product.featured_image);
    }
    if (product.images && Array.isArray(product.images)) {
      const otherImages = product.images.filter(img => img !== product.featured_image);
      images.push(...otherImages);
    }
    return images;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="product">
          <div className="product__inner">
            <div className="product__loading">
              Loading product details...
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <section className="product">
          <div className="product__inner">
            <div className="product__error">
              <h2>Product not found</h2>
              <p>The product you're looking for doesn't exist.</p>
              <p>Product ID: {id}</p>
              <Link to="/marketplace" className="product__backLink">
                Back to Marketplace
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const allImages = getAllImages();

  return (
    <div>
      <Navbar />
      <section className="product">
        <div className="product__inner">
          <div className="product__breadcrumb">
            <Link className="product__crumb" to="/marketplace">
              Marketplace
            </Link>
            <span className="product__sep">›</span>
            <span className="product__crumb product__crumb--active">
              {product.name}
            </span>
          </div>

          <div className="product__top">
            <div className="product__gallery">
              <div 
                className="product__hero" 
                style={{
                  backgroundImage: `url(${allImages[selectedImageIndex] || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="product__thumbs">
                {allImages.length > 0 ? (
                  allImages.map((image, index) => (
                    <div 
                      key={index} 
                      className={`product__thumb ${selectedImageIndex === index ? 'product__thumb--active' : ''}`}
                      onClick={() => setSelectedImageIndex(index)}
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        cursor: 'pointer'
                      }}
                    />
                  ))
                ) : (
                  <>
                    <div className="product__thumb" />
                    <div className="product__thumb" />
                    <div className="product__thumb" />
                    <div className="product__thumb" />
                  </>
                )}
              </div>
            </div>

            <aside className="product__sidebar">
              <div className="product__priceCard">
                <div className="product__priceRow">
                  <div>
                    <div className="product__price">${product.price.toFixed(2)}</div>
                    <div className="product__currency">{product.currency}</div>
                  </div>
                  {product.verified && (
                    <div className="product__verified">
                      <img src={VerifiedIcon} alt="" />
                      Verified Code
                    </div>
                  )}
                </div>

                <div className="product__included">
                  <h3>What&apos;s Included</h3>
                  <ul>
                    {product.includes_support && (
                      <li>
                        <span className="product__check">
                          <img src={CustomerSupportIcon} alt="" />
                        </span>
                        6-month of technical support included
                      </li>
                    )}
                    {product.includes_updates && (
                      <li>
                        <span className="product__check">
                          <img src={UpdatesIcon} alt="" />
                        </span>
                        Access to future updates included
                      </li>
                    )}
                    {product.commercial_license && (
                      <li>
                        <span className="product__check">
                          <img src={LicensedIcon} alt="" />
                        </span>
                        Licensed for commercial use
                      </li>
                    )}
                  </ul>
                </div>

                <button 
                  className="product__cta" 
                  type="button"
                  onClick={handleBuyNow}
                  disabled={addingToCart}
                >
                  {addingToCart ? "Adding to Cart..." : "Buy Now"}
                </button>

                {cartMessage && (
                  <div className={`product__cartMessage ${cartMessage.includes("Failed") || cartMessage.includes("Please login") ? "error" : ""}`}>
                    {cartMessage}
                  </div>
                )}
                <Link className="product__ghost" to="/contact">
                  <img src={MailIcon} alt="Mail" className="product__icon" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Contact CertiCode
                </Link>
              </div>

              <div className="product__metaCard">
                <h3>Asset Details</h3>
                <div className="product__metaGrid">
                  <div>
                    <span>Released</span>
                    <strong>{product.released_date}</strong>
                  </div>
                  <div>
                    <span>Last Update</span>
                    <strong>{product.last_update}</strong>
                  </div>
                  <div>
                    <span>Category</span>
                    <strong>{product.asset_type}</strong>
                  </div>
                  <div>
                    <span>File Size</span>
                    <strong>{product.file_size}</strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <section className="product__details">
            <div className="product__tabs">
              <button
                className={`product__tab${
                  activeTab === "overview" ? " product__tab--active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`product__tab${
                  activeTab === "tech" ? " product__tab--active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("tech")}
              >
                Tech Stack
              </button>
              <button
                className={`product__tab${
                  activeTab === "features" ? " product__tab--active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("features")}
              >
                Features
              </button>
              <button
                className={`product__tab${
                  activeTab === "reviews" ? " product__tab--active" : ""
                }`}
                type="button"
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviews_count})
              </button>
            </div>

            <div className="product__tabContent">
              {activeTab === "overview" && (
                <ProductOverview product={product} />
              )}
              {activeTab === "tech" && (
                <ProductTechStack technologies={product.technologies} productId={product.id} />
              )}
              {activeTab === "features" && (
                <ProductFeatures features={product.features} productId={product.id} />
              )}
              {activeTab === "reviews" && <ProductReviews productId={product.id} />}
            </div>
          </section>

          <section className="product__related">
            <div className="product__relatedHeader">
              <div>
                <h3>You may also like</h3>
                <p>
                  Explore similar high-quality digital assets for your next
                  project.
                </p>
              </div>
              <Link to={`/marketplace?category=${product.asset_type}`}>
                <button className="product__viewAll" type="button">
                  View All
                </button>
              </Link>
            </div>

            <div className="product__relatedGrid">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((item) => (
                  <Link 
                    key={item.id} 
                    to={`/marketplace/${item.id}`}
                    state={{ fromRelated: true }}
                  >
                    <article className="product__relatedCard">
                      <div 
                        className="product__relatedMedia"
                        style={{
                          backgroundImage: `url(${item.featured_image || ''})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                      <div className="product__relatedBody">
                        <h4>{item.name || item.title}</h4>
                        <div className="product__relatedMeta">
                          <span className="product__relatedVendor">
                            <img src={CerticodeBoxIcon} alt="" />
                            {item.vendor}
                          </span>
                          <span className="product__relatedPrice">
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                        </div>
                        <div
                          className="product__relatedDivider"
                          aria-hidden="true"
                        />
                        <div className="product__relatedFooter">
                          <div className="product__rating">
                            <span className="product__star">★</span>
                            <span>{item.rating}</span>
                          </div>
                          <button className="product__cart" type="button">
                            <img src={Cart} alt="Add to cart" />
                          </button>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <p className="product__noRelated">No related products found.</p>
              )}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetails;
