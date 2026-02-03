import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom"; // ← Add useLocation
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/ProductDetails.css";
import CerticodeBoxIcon from "../../assets/CerticodeBoxIcon.png";
import Cart from "../../assets/Cart.png";
import VerifiedIcon from "../../assets/Verified.png";
import CustomerSupportIcon from "../../assets/CustomerSupport.png";
import UpdatesIcon from "../../assets/Updates.png";
import LicensedIcon from "../../assets/Licensed.png";
import ProductOverview from "../../components/ProductOverview";
import ProductTechStack from "../../components/ProductTechStack";
import ProductFeatures from "../../components/ProductFeatures";
import ProductReviews from "../../components/ProductReviews";
import { api } from "../../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation(); // ← Add this
  const [activeTab, setActiveTab] = useState("overview");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [passedFromState, setPassedFromState] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    
    // Check if product data was passed from Marketplace
    if (location.state && location.state.product) {
      console.log("Product data passed from state:", location.state.product);
      handleProductFromState(location.state.product);
      setPassedFromState(true);
    } else {
      // No state passed, fetch from API
      fetchProductDetails();
    }
  }, [id, location.state]);

  const handleProductFromState = (productFromState) => {
    // Map Marketplace format to ProductDetails format
    const mappedProduct = {
      id: productFromState.id,
      name: productFromState.title, // Marketplace uses "title", ProductDetails uses "name"
      description: productFromState.description,
      price: productFromState.price,
      currency: "USD",
      asset_type: productFromState.asset_type,
      released_date: "Oct 12, 2023", // Static - no backend alternative
      last_update: "2 days ago", // Static - no backend alternative
      file_size: "42.5 MB", // Static - no backend alternative
      rating: productFromState.rating || "4.8",
      technologies: productFromState.technologies,
      features: productFromState.features,
      specifications: [], // Static - no backend alternative
      image_urls: productFromState.image_urls,
      vendor: "CertiCode", // Static - no backend alternative
      verified: true, // Static - no backend alternative
      includes_support: true, // Static - no backend alternative
      includes_updates: true, // Static - no backend alternative
      commercial_license: true, // Static - no backend alternative
      reviews_count: 12 // Static - no backend alternative
    };
    
    console.log("Mapped product from state:", mappedProduct);
    setProduct(mappedProduct);
    setLoading(false);
    
    // Still fetch from API in background for fresh data
    fetchProductDetails();
  };

  const fetchProductDetails = async () => {
    try {
      // Only set loading if we don't already have state data
      if (!passedFromState) {
        setLoading(true);
      }
      
      console.log(`Fetching product ${id} from API`);
      const result = await api.getProductById(id);
      console.log('API Result:', result);
      
      // Get the product data from response
      const productData = result.data || result;
      
      if (!productData) {
        console.log('No product data received from API');
        // Don't set product to null if we have state data
        if (!passedFromState) {
          setProduct(null);
        }
        setLoading(false);
        return;
      }
      
      console.log('API Product Data:', productData);
      
      // Only update if we don't have state data OR if API has more complete data
      const apiProduct = {
        id: productData.id,
        name: productData.name, // Backend has "name"
        description: productData.description,
        price: parseFloat(productData.price),
        currency: "USD",
        asset_type: productData.asset_type,
        released_date: "Oct 12, 2023", // Static - no backend alternative
        last_update: "2 days ago", // Static - no backend alternative
        file_size: "42.5 MB", // Static - no backend alternative
        rating: "4.8", // Static - no backend alternative
        technologies: productData.technologies,
        features: productData.features,
        specifications: [], // Static - no backend alternative
        image_urls: productData.images, // Backend has "images" not "image_urls"
        vendor: "CertiCode", // Static - no backend alternative
        verified: true, // Static - no backend alternative
        includes_support: true, // Static - no backend alternative
        includes_updates: true, // Static - no backend alternative
        commercial_license: true, // Static - no backend alternative
        reviews_count: 12 // Static - no backend alternative
      };
      
      // Update product with API data (will overwrite state data with fresh API data)
      console.log('Setting product from API:', apiProduct);
      setProduct(apiProduct);
      
      // Fetch related products
      if (apiProduct.asset_type) {
        try {
          const relatedResult = await api.getProducts("", apiProduct.asset_type, 1);
          const related = relatedResult.data
            .filter(item => item.id !== apiProduct.id)
            .slice(0, 4)
            .map(item => ({
              id: item.id,
              title: item.name, // Backend has "name", frontend expects "title"
              price: `$${item.price}`,
              rating: "4.2",
              vendor: "CertiCode"
            }));
          setRelatedProducts(related);
        } catch (error) {
          console.error("Error fetching related products:", error);
        }
      }
      
    } catch (error) {
      console.error("Error fetching from API:", error);
      // Only set to null if we don't have state data
      if (!passedFromState) {
        setProduct(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="product">
          <div className="product__inner">
            <div className="product__loading">
              Loading product details...
              {passedFromState && <div style={{ fontSize: '12px', marginTop: '5px' }}>(Using passed data from Marketplace)</div>}
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
              <div className="product__hero" />
              <div className="product__thumbs">
                {product.image_urls && product.image_urls.length > 0 ? (
                  product.image_urls.slice(0, 4).map((image, index) => (
                    <div key={index} className="product__thumb" />
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

                <Link to="/cart">
                  <button className="product__cta" type="button">
                    Buy Now
                  </button>
                </Link>

                <button className="product__ghost" type="button">
                  Contact CertiCode
                </button>
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
                <ProductOverview 
                  product={product}
                />
              )}
              {activeTab === "tech" && (
                <ProductTechStack technologies={product.technologies} />
              )}
              {activeTab === "features" && (
                <ProductFeatures features={product.features} />
              )}
              {activeTab === "reviews" && <ProductReviews />}
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
                    state={{ product: item }}
                  >
                    <article className="product__relatedCard">
                      <div className="product__relatedMedia" />
                      <div className="product__relatedBody">
                        <h4>{item.title}</h4>
                        <div className="product__relatedMeta">
                          <span className="product__relatedVendor">
                            <img src={CerticodeBoxIcon} alt="" />
                            {item.vendor}
                          </span>
                          <span className="product__relatedPrice">
                            {item.price}
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