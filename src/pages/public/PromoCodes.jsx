import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PromoCodesEmptyState from "../../components/PromoCodesEmptyState";
import "../../styles/PromoCodes.css";
import SearchIcon from "../../assets/lucide_search.png";
import CopyIcon from "../../assets/Copy.png";
import GrayCheck from "../../assets/GrayCheck.png";
import DeleteIcon from "../../assets/Delete.png";

const vouchers = [
  {
    id: 1,
    value: "$50 OFF",
    title: "Valid on all UI Kits",
    status: "active",
    badge: "Active",
    metaLabel: "Expires:",
    metaValue: "Jan 31, 2026",
    code: "CERT50UIKIT",
  },
  {
    id: 2,
    value: "$20% OFF",
    title: "Mobile App Templates",
    status: "expiring",
    badge: "Expiring Soon",
    metaLabel: "",
    metaValue: "Expires in 2 days",
    code: "MOBAPP20OFF",
  },
  {
    id: 3,
    value: "$100 OFF",
    title: "SaaS Launch Promo",
    status: "active",
    badge: "Active",
    metaLabel: "Expires:",
    metaValue: "Jan 31, 2026",
    code: "LAUNCHSAAS",
  },
  {
    id: 4,
    value: "15% OFF",
    title: "Loyalty Discount",
    status: "used",
    badge: "Used",
    metaLabel: "Applied on",
    metaValue: "Jan 21, 2026",
    code: "LOYALTY15",
  },
];

const historyItems = [
  {
    id: 1,
    icon: GrayCheck,
    tone: "neutral",
    title: "LOYALTY15 Used",
    desc: 'Applied on "Fintech Banking Dashboard" purchase.',
    date: "Jan 21, 2026",
  },
  {
    id: 2,
    icon: DeleteIcon,
    tone: "danger",
    title: "SUMMER25 Expired",
    desc: "25% discount voucher expired without use.",
    date: "May 01, 2025",
  },
  {
    id: 3,
    icon: GrayCheck,
    tone: "neutral",
    title: "FREELANCE5 Used",
    desc: 'Applied on "Portfolio Template" purchase.',
    date: "Mar 05, 2025",
  },
];

const steps = [
  "Browse and copy the voucher code you want to use.",
  "Head to your cart with your selected digital assets.",
  'Paste the code into the "Promo Code" field and click apply.',
];

const PromoCodes = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const hasVouchers = vouchers.length > 0;

  return (
    <div>
      <Navbar />
      <section className="promo">
        <div className="promo__inner">
          <div className="promo__breadcrumb">
            <Link className="promo__crumb" to="/cart">
              Your Cart
            </Link>
            <span className="promo__sep">&rsaquo;</span>
            <span className="promo__crumb promo__crumb--active">
              Promo Codes
            </span>
          </div>

          <div className="promo__header">
            <div className="promo__titleGroup">
              <h1>My Vouchers</h1>
              <p>
                Manage your promo codes and exclusive marketplace discounts.
              </p>
            </div>

            <div className="promo__search">
              <img src={SearchIcon} alt="" aria-hidden="true" />
              <input type="text" placeholder="Search vouchers..." />
            </div>
          </div>

          <div className="promo__layout">
            <div className="promo__vouchers">
              {hasVouchers ? (
                <>
                  <div className="promo__grid">
                    {vouchers.map((voucher) => (
                      <article
                        key={voucher.id}
                        className={`promoCard promoCard--${voucher.status}`}
                      >
                        <div className="promoCard__header">
                          <div>
                            <div className="promoCard__value">
                              {voucher.value}
                            </div>
                            <div className="promoCard__title">
                              {voucher.title}
                            </div>
                          </div>
                          <span
                            className={`promoCard__badge promoCard__badge--${voucher.status}`}
                          >
                            {voucher.badge}
                          </span>
                        </div>

                        <div
                          className={`promoCard__meta${
                            voucher.status === "expiring"
                              ? " promoCard__meta--danger"
                              : ""
                          }`}
                        >
                          {voucher.metaLabel && (
                            <span className="promoCard__metaLabel">
                              {voucher.metaLabel}
                            </span>
                          )}
                          <span className="promoCard__metaValue">
                            {voucher.metaValue}
                          </span>
                        </div>

                        <div
                          className={`promoCard__codeRow${
                            voucher.status === "used"
                              ? " promoCard__codeRow--disabled"
                              : ""
                          }`}
                        >
                          <span className="promoCard__code">
                            {voucher.code}
                          </span>
                          {voucher.status === "used" ? (
                            <span className="promoCard__applied">Applied</span>
                          ) : (
                            <button className="promoCard__copy" type="button">
                              <img src={CopyIcon} alt="" aria-hidden="true" />
                              Copy
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  <button className="promo__more" type="button">
                    Load More Vouchers
                  </button>
                </>
              ) : (
                <PromoCodesEmptyState />
              )}
            </div>

            <aside className="promo__aside">
              <div className="promo__card promo__card--how">
                <h3>How To Use?</h3>
                <div className="promo__cardDivider" aria-hidden="true" />
                <div className="promo__steps">
                  {steps.map((step, index) => (
                    <div className="promo__step" key={step}>
                      <span className="promo__stepNum">{index + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="promo__card promo__card--history">
                <h3>History Activity</h3>
                <div className="promo__cardDivider" aria-hidden="true" />
                <div className="promo__history">
                  {historyItems.map((item) => (
                    <div className="promo__historyItem" key={item.id}>
                      <span
                        className={`promo__historyIcon promo__historyIcon--${item.tone}`}
                      >
                        <img src={item.icon} alt="" aria-hidden="true" />
                      </span>
                      <div className="promo__historyBody">
                        <div className="promo__historyTitle">{item.title}</div>
                        <div className="promo__historyDesc">{item.desc}</div>
                        <div className="promo__historyDate">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="promo__historyBtn" type="button">
                  View All History
                </button>
              </div>

              <div className="promo__card promo__card--help">
                <h3>Need Help?</h3>
                <p>
                  Having trouble with a voucher code? Our support team is here
                  to help you 24/7.
                </p>
                <button className="promo__helpLink" type="button">
                  Contact Support <span aria-hidden="true">›</span>
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PromoCodes;
