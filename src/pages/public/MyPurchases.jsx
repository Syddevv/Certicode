import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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

const assets = [
  {
    title: "E-commerce SaaS Template",
    subtitle: "Saas Template",
    version: "v2.4.1",
    tags: [
      { label: "Node.js", tone: "green" },
      { label: "React", tone: "blue" },
    ],
    status: "Update Ready",
    updated: "Updated 5 Jan 2025",
  },
  {
    title: "FoodieExpress Delivery App",
    subtitle: "Website App",
    version: "v3.2.1",
    tags: [
      { label: "Firebase", tone: "pink" },
      { label: "Flutter", tone: "purple" },
      { label: "Node.js", tone: "green" },
    ],
    status: "Active",
    updated: "Updated 12 Dec 2025",
  },
  {
    title: "FinTech Banking Dashboard",
    subtitle: "UI Kit",
    version: "v3.2.1",
    tags: [
      { label: "Adobe XD", tone: "violet" },
      { label: "Figma", tone: "rose" },
    ],
    status: "Active",
    updated: "Updated 12 Dec 2025",
  },
];

const MyPurchases = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="purchases">
        <div className="purchases__inner">
          <div className="purchases-profile">
            <div className="purchases-profile__info">
              <div className="purchases-profile__avatarWrap">
                <img
                  className="purchases-profile__avatar"
                  src={Avatar}
                  alt="Jane Doe"
                />
                <span
                  className="purchases-profile__status"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h2>Jane Doe</h2>
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
              Account Settings
            </button>
            <button className="purchases-tab" type="button">
              Support
            </button>
          </div>

          <div className="purchases__content">
            <div className="purchases-main">
              <div className="purchases-main__header">
                <h3>Your Asset Library</h3>
              </div>

              <div className="purchases-filters">
                <div className="purchases-filters__top">
                  <div className="purchases-search">
                    <span className="purchases-search__icon" aria-hidden="true">
                      <img src={SearchIcon} alt="" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search your assets by name or tech stack..."
                    />
                  </div>
                  <button className="purchases-action" type="button">
                    <span className="purchases-action__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M4 6h16M7 12h10M10 18h4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Filter
                  </button>
                  <button className="purchases-action" type="button">
                    <span className="purchases-action__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M7 6h10M5 12h14M9 18h6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Sort by
                  </button>
                </div>

                <div className="purchases-filters__chips">
                  <button
                    className="purchases-chip purchases-chip--active"
                    type="button"
                  >
                    Asset Type: All <span aria-hidden="true">{"\u00d7"}</span>
                  </button>
                  <button className="purchases-chip" type="button">
                    Tech Stack <img src={ArrowDown} alt="" aria-hidden="true" />
                  </button>
                  <button className="purchases-chip" type="button">
                    License Status{" "}
                    <img src={ArrowDown} alt="" aria-hidden="true" />
                  </button>
                  <button className="purchases-clear" type="button">
                    Clear All
                  </button>
                </div>
              </div>

              <div className="purchases-list">
                {assets.map((asset) => (
                  <article key={asset.title} className="purchases-item">
                    <div className="purchases-item__media" />
                    <div className="purchases-item__body">
                      <div className="purchases-item__tags">
                        {asset.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={`purchases-tag purchases-tag--${tag.tone}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <h4>{asset.title}</h4>
                      <p>
                        {asset.subtitle} <span>{"\u2022"}</span> {asset.version}
                      </p>
                    </div>
                    <div className="purchases-item__meta">
                      <span
                        className={`purchases-status${
                          asset.status === "Update Ready" ? " is-warning" : ""
                        }`}
                      >
                        <span className="purchases-status__dot" />
                        {asset.status}
                      </span>
                      <span className="purchases-updated">{asset.updated}</span>
                    </div>
                    <button className="purchases-download" type="button">
                      <img src={WhiteDownload} alt="" aria-hidden="true" />
                      Download
                    </button>
                    <button
                      className="purchases-more"
                      type="button"
                      aria-label="More options"
                    >
                      ...
                    </button>
                  </article>
                ))}
              </div>
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

                <div className="purchases-update">
                  <div className="purchases-update__icon">
                    <img src={OrangeBadge} alt="" aria-hidden="true" />
                  </div>
                  <div>
                    <strong>v2.4.2 Available</strong>
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
                  <div className="purchases-info__row">
                    <span>Key</span>
                    <strong className="purchases-key">CT-98X2-442L</strong>
                  </div>
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

                <button className="purchases-primary" type="button">
                  <img src={WhiteDownload} alt="" aria-hidden="true" />
                  Download Latest (v2.4.2)
                </button>
                <button className="purchases-secondary" type="button">
                  View Full License
                </button>
                <button className="purchases-alert" type="button">
                  Report Issue
                </button>
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
