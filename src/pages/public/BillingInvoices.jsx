import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BillingInvoices.css";
import Avatar from "../../assets/Avatar.png";
import VerifiedBadge from "../../assets/Verified.png";
import InvoiceIcon from "../../assets/Invoice.png";
import ChartBar from "../../assets/ChartBar.png";
import OrangeBag from "../../assets/orangeBag.png";
import OrangeDownload from "../../assets/orangeDownload.png";
import GrayWallet from "../../assets/graywallet.png";
import OrangeStar from "../../assets/orangestar.png";
import SearchIcon from "../../assets/lucide_search.png";

const stats = [
  { label: "Total Invoices", value: "3", icon: InvoiceIcon },
  { label: "Total Volume", value: "$4,200.00", icon: ChartBar },
  { label: "Last Invoice", value: "Jan 20, 2026", icon: OrangeBag },
];

const invoices = [
  {
    id: "#INV-8273",
    asset: "E-commerce SaaS Template",
    date: "Dec 28, 2025",
    amount: "$999.00",
    status: "Paid",
  },
  {
    id: "#INV-8265",
    asset: "FoodieExpress Delivery App",
    date: "Nov 30, 2025",
    amount: "$1,499.00",
    status: "Paid",
  },
  {
    id: "#INV-8199",
    asset: "FinTech Banking Dashboard",
    date: "Oct 22, 2025",
    amount: "$450.00",
    status: "Paid",
  },
];

const BillingInvoices = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="billing">
        <div className="billing__inner">
          <div className="billing-profile">
            <div className="billing-profile__info">
              <div className="billing-profile__avatarWrap">
                <img
                  className="billing-profile__avatar"
                  src={Avatar}
                  alt="Jane Doe"
                />
                <span className="billing-profile__status" aria-hidden="true" />
              </div>
              <div>
                <h2>Jane Doe</h2>
                <span className="billing-profile__badge">
                  <img src={VerifiedBadge} alt="" aria-hidden="true" />
                  Verified User
                </span>
              </div>
            </div>
            <button className="billing-profile__edit" type="button">
              <span className="billing-profile__editIcon" aria-hidden="true">
                {"\u270e"}
              </span>
              Edit Profile
            </button>
          </div>

          <div className="billing-tabs">
            <Link className="billing-tab" to="/buyer-dashboard">
              Dashboard
            </Link>
            <Link className="billing-tab" to="/my-purchases">
              My Purchases
            </Link>
            <button className="billing-tab billing-tab--active" type="button">
              Billing &amp; Invoices
            </button>
            <button className="billing-tab" type="button">
              <Link className="buyer-tab" to="/account-settings">
                Account Settings
              </Link>
            </button>
            <Link className="billing-tab" to="/customer-support">
              Support
            </Link>
          </div>

          <div className="billing__content">
            <div className="billing-main">
              <div className="billing-main__header">
                <h3>Billing &amp; Invoices</h3>
              </div>

              <div className="billing-stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="billing-stat">
                    <span className="billing-stat__icon">
                      <img src={stat.icon} alt="" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="billing-stat__label">{stat.label}</span>
                      <div className="billing-stat__value">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="billing-filters">
                <div className="billing-search">
                  <span className="billing-search__icon" aria-hidden="true">
                    <img src={SearchIcon} alt="" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search your assets by name or tech stack..."
                  />
                </div>
                <button className="billing-action" type="button">
                  <span className="billing-action__icon" aria-hidden="true">
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
                <button className="billing-action" type="button">
                  <span className="billing-action__icon" aria-hidden="true">
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

              <div className="billing-table">
                <div className="billing-table__head">
                  <span>Invoice No.</span>
                  <span>Asset</span>
                  <span>Date</span>
                  <span>Amount</span>
                  <span>Status</span>
                  <span>Actions</span>
                </div>
                {invoices.map((row) => (
                  <div key={row.id} className="billing-row">
                    <span className="billing-row__id">{row.id}</span>
                    <div className="billing-row__asset">
                      <span className="billing-row__thumb" />
                      <span>{row.asset}</span>
                    </div>
                    <span>{row.date}</span>
                    <span>{row.amount}</span>
                    <span className="billing-row__status">
                      <span className="billing-status">Paid</span>
                    </span>
                    <div className="billing-row__actions">
                      <button
                        className="billing-iconBtn"
                        type="button"
                        aria-label="Download"
                      >
                        <img src={OrangeDownload} alt="" aria-hidden="true" />
                      </button>
                      {row.id === "#INV-8273" ? (
                        <Link
                          className="billing-iconBtn"
                          to="/billing-invoices/inv-8273"
                          aria-label="View"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                          </svg>
                        </Link>
                      ) : (
                        <button
                          className="billing-iconBtn"
                          type="button"
                          aria-label="View"
                        >
                          <svg viewBox="0 0 24 24">
                            <path
                              d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            />
                            <circle cx="12" cy="12" r="3" fill="currentColor" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="billing-table__footer">
                  <span>Showing page 1 of 1</span>
                  <div className="billing-pagination">
                    <button type="button" aria-label="Previous">
                      {"<"}
                    </button>
                    <button className="is-active" type="button">
                      1
                    </button>
                    <button type="button" aria-label="Next">
                      {">"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <aside className="billing-side">
              <div className="billing-card">
                <div className="billing-card__header">
                  <h4>Billing Details</h4>
                  <img
                    className="billing-card__icon"
                    src={InvoiceIcon}
                    alt=""
                    aria-hidden="true"
                  />
                </div>

                <div className="billing-section">
                  <div className="billing-section__title">Company Address</div>
                  <strong>Horizon Tech Solutions LLC</strong>
                  <p>452 Market Street, Ste 1200, San Francisco, CA 94104</p>
                </div>

                <div className="billing-section">
                  <div className="billing-section__title">Tax ID / VAT</div>
                  <strong>US 99-8273645</strong>
                </div>

                <div className="billing-section">
                  <div className="billing-section__title">Primary Method</div>
                  <div className="billing-method">
                    <span className="billing-method__icon">
                      <img src={GrayWallet} alt="" aria-hidden="true" />
                    </span>
                    <div>
                      <strong>Visa ending 4242</strong>
                      <span>Expires 12/26</span>
                    </div>
                    <button className="billing-link" type="button">
                      Edit
                    </button>
                  </div>
                  <button className="billing-secondary" type="button">
                    Manage Billing Details
                  </button>
                </div>
              </div>

              <div className="billing-card billing-support">
                <div className="billing-support__content">
                  <h5>Need Billing Support?</h5>
                  <p>
                    Our finance team typically responds within 4 hours during
                    business days.
                  </p>
                  <Link className="billing-primary" to="/customer-support">
                    Contact Support
                  </Link>
                </div>
                <img
                  className="billing-support__spark"
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

export default BillingInvoices;
