import React, { useEffect, useState } from "react";
import "../../styles/Marketplace.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import ViewProduct from "../../assets/ViewProduct.png";

const categoryTabs = [
  "All Assets",
  "Website Apps",
  "Mobile Apps",
  "UI/UX Design",
  "Custom Projects",
];

const assets = [
  {
    title: "E-commerce SaaS Template",
    description:
      "Complete multivendor marketplace solution with admin dashboard and analytics.",
    price: "$999",
    path: "/marketplace/e-commerce-saas-template",
    tags: [
      { label: "Node.js", tone: "green" },
      { label: "React", tone: "blue" },
    ],
  },
  {
    title: "FoodieExpress Delivery App",
    description:
      "Ready to launch food delivery mobile application for iOS and Android.",
    price: "$1,499",
    tags: [
      { label: "Firebase", tone: "pink" },
      { label: "Flutter", tone: "purple" },
      { label: "Node.js", tone: "green" },
    ],
  },
  {
    title: "Fintech Banking Dashboard",
    description:
      "Premium UI kit with over 100+ high-quality screens and fully layered files.",
    price: "$450",
    tags: [
      { label: "Adobe XD", tone: "violet" },
      { label: "Figma", tone: "rose" },
    ],
  },
  {
    title: "Developer Portfolio Website",
    description:
      "Minimalist and fast portfolio template for designers and developers.",
    price: "$199",
    tags: [
      { label: "React", tone: "blue" },
      { label: "Tailwind", tone: "orange" },
    ],
  },
  {
    title: "SmartLMS - Education Suite",
    description:
      "Robust LMS with course builder, student portal, and payment integration.",
    price: "$2,100",
    tags: [
      { label: "Django", tone: "green" },
      { label: "Node.js", tone: "mint" },
      { label: "Python", tone: "gold" },
    ],
  },
  {
    title: "FitLife Tracker Mobile App",
    description:
      "iOS native fitness tracking application with workout plans and nutrition logs.",
    price: "$1,250",
    tags: [
      { label: "Flutter", tone: "purple" },
      { label: "Swift", tone: "indigo" },
    ],
  },
];

const Marketplace = () => {
  const [activeTab, setActiveTab] = useState("All Assets");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                className={`marketplace__tab${
                  activeTab === tab ? " marketplace__tab--active" : ""
                }`}
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
              >
                <span className="marketplace__tabLabel">{tab}</span>
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
                {[
                  "Adobe XD",
                  "Django",
                  "Figma",
                  "Firebase",
                  "Flutter",
                  "Node.js",
                  "Python",
                  "React",
                  "Swift",
                  "Tailwind",
                ].map((item) => (
                  <label key={item} className="marketplace__check">
                    <input type="checkbox" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className="marketplace__filterGroup">
                <h4>Price Range</h4>
                {["Under $500", "$500 - $2,000", "$2,000 - $5,000"].map(
                  (item) => (
                    <label key={item} className="marketplace__check">
                      <input type="checkbox" />
                      <span>{item}</span>
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
                <span>Showing 24 assets found</span>
                <button className="marketplace__sort" type="button">
                  Sort by: <strong>Newest First</strong>
                  <span className="marketplace__sortIcon">▾</span>
                </button>
              </div>

              <div className="marketplace__cards">
                {assets.map((asset) => (
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
                            {asset.price}
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

              <div className="marketplace__pagination">
                <button className="marketplace__page" type="button">
                  ‹
                </button>
                <button
                  className="marketplace__page marketplace__page--active"
                  type="button"
                >
                  1
                </button>
                <button className="marketplace__page" type="button">
                  2
                </button>
                <button className="marketplace__page" type="button">
                  3
                </button>
                <span className="marketplace__pageEllipsis">...</span>
                <button className="marketplace__page" type="button">
                  12
                </button>
                <button className="marketplace__page" type="button">
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
