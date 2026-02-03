import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BuyerDashboard.css";
import Avatar from "../../assets/Avatar.png";
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

const stats = [
  { label: "Total Assets", value: "3", icon: OrangeBox },
  { label: "Active Licenses", value: "2", icon: OrangeBadge },
  { label: "Last Purchase", value: "Jan 20, 2026", icon: OrangeBag },
];

const assets = [
  {
    title: "E-commerce SaaS Template",
    subtitle: "Saas Template",
    version: "v2.4.1",
    tags: [
      { label: "Node.js", tone: "green" },
      { label: "React", tone: "blue" },
    ],
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
  },
  {
    title: "FinTech Banking Dashboard",
    subtitle: "UI Kit",
    version: "v3.2.1",
    tags: [
      { label: "Adobe XD", tone: "violet" },
      { label: "Figma", tone: "rose" },
    ],
  },
];

const activities = [
  {
    title: "Asset downloaded: FoodieExpress Delivery App",
    time: "2 hours ago",
    icon: OrangeDownload,
  },
  {
    title: "License renewed for E-commerce SaaS Template",
    time: "1 day ago",
    icon: LicensedRenewed,
  },
  {
    title: "Invoice #INV-9281 generated",
    time: "5 days ago",
    icon: InvoiceIcon,
  },
];

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

const BuyerDashboard = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="buyer-dashboard">
        <div className="buyer-dashboard__inner">
          <div className="buyer-card buyer-profile">
            <div className="buyer-profile__info">
              <div className="buyer-profile__avatarWrap">
                <img
                  className="buyer-profile__avatar"
                  src={Avatar}
                  alt="Jane Doe"
                />
                <span className="buyer-profile__status" aria-hidden="true" />
              </div>
              <div>
                <h2>Jane Doe</h2>
                <span className="buyer-profile__badge">
                  <img src={VerifiedBadge} alt="" aria-hidden="true" />
                  Verified User
                </span>
              </div>
            </div>
            <button className="buyer-profile__edit" type="button">
              <span className="buyer-profile__editIcon" aria-hidden="true">
                {"\u270e"}
              </span>
              Edit Profile
            </button>
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
                    <input type="text" placeholder="Search assets..." />
                  </div>
                </div>

                <div className="buyer-assets">
                  {assets.map((asset) => (
                    <article key={asset.title} className="buyer-asset">
                      <div className="buyer-asset__media" />
                      <div className="buyer-asset__body">
                        <div className="buyer-asset__tags">
                          {asset.tags.map((tag) => (
                            <span
                              key={tag.label}
                              className={`buyer-tag buyer-tag--${tag.tone}`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                        <h5>{asset.title}</h5>
                        <p>
                          {asset.subtitle}{" "}
                          <span className="buyer-dot">{"\u2022"}</span>{" "}
                          {asset.version}
                        </p>
                        <button className="buyer-asset__download" type="button">
                          <img src={WhiteDownload} alt="" aria-hidden="true" />
                          Download
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <Link className="buyer-assets__link" to="/marketplace">
                  View all assets <span aria-hidden="true">{"\u203a"}</span>
                </Link>
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
                  {activities.map((activity) => (
                    <li key={activity.title} className="buyer-activity__item">
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
                <button className="buyer-activity__cta" type="button">
                  View Full History
                </button>
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
