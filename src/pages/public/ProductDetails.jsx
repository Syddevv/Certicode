import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

const ProductDetails = () => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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
              E-commerce SaaS Template
            </span>
          </div>

          <div className="product__top">
            <div className="product__gallery">
              <div className="product__hero" />
              <div className="product__thumbs">
                <div className="product__thumb" />
                <div className="product__thumb" />
                <div className="product__thumb" />
                <div className="product__thumb" />
              </div>
            </div>

            <aside className="product__sidebar">
              <div className="product__priceCard">
                <div className="product__priceRow">
                  <div>
                    <div className="product__price">$999.00</div>
                    <div className="product__currency">USD</div>
                  </div>
                  <div className="product__verified">
                    <img src={VerifiedIcon} alt="" />
                    Verified Code
                  </div>
                </div>

                <div className="product__included">
                  <h3>What&apos;s Included</h3>
                  <ul>
                    <li>
                      <span className="product__check">
                        <img src={CustomerSupportIcon} alt="" />
                      </span>
                      6-month of technical support included
                    </li>
                    <li>
                      <span className="product__check">
                        <img src={UpdatesIcon} alt="" />
                      </span>
                      Access to future updates included
                    </li>
                    <li>
                      <span className="product__check">
                        <img src={LicensedIcon} alt="" />
                      </span>
                      Licensed for commercial use
                    </li>
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
                    <strong>Oct 12, 2023</strong>
                  </div>
                  <div>
                    <span>Last Update</span>
                    <strong>2 days ago</strong>
                  </div>
                  <div>
                    <span>Category</span>
                    <strong>Website Apps</strong>
                  </div>
                  <div>
                    <span>File Size</span>
                    <strong>42.5 MB</strong>
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
                Reviews (12)
              </button>
            </div>

            <div className="product__tabContent">
              {activeTab === "overview" && <ProductOverview />}
              {activeTab === "tech" && <ProductTechStack />}
              {activeTab === "features" && <ProductFeatures />}
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
              <button className="product__viewAll" type="button">
                View All
              </button>
            </div>

            <div className="product__relatedGrid">
              {[
                {
                  title: "FoodieExpress Delivery App",
                  price: "$1,499",
                  rating: "4.2",
                },
                {
                  title: "Fintech Banking Dashboard",
                  price: "$450",
                  rating: "4.5",
                },
                {
                  title: "Job Board Fullstack App",
                  price: "$799",
                  rating: "4.9",
                },
                {
                  title: "AI Marketing Platform UI",
                  price: "$850",
                  rating: "4.8",
                },
              ].map((item) => (
                <article key={item.title} className="product__relatedCard">
                  <div className="product__relatedMedia" />
                  <div className="product__relatedBody">
                    <h4>{item.title}</h4>
                    <div className="product__relatedMeta">
                      <span className="product__relatedVendor">
                        <img src={CerticodeBoxIcon} alt="" />
                        CertiCode
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
              ))}
            </div>
          </section>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductDetails;
