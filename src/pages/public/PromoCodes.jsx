import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PromoCodesEmptyState from "../../components/PromoCodesEmptyState";
import "../../styles/PromoCodes.css";
import SearchIcon from "../../assets/lucide_search.png";
import CopyIcon from "../../assets/Copy.png";
import GrayCheck from "../../assets/GrayCheck.png";
import DeleteIcon from "../../assets/Delete.png";
import { PromoAPI } from "../../services/PromoAPI";

const steps = [
  "Browse and copy the voucher code you want to use.",
  "Head to your cart with your selected digital assets.",
  'Paste the code into the "Promo Code" field and click apply.',
];

const PromoCodes = () => {
  const [vouchers, setVouchers] = useState([]);
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState("");
  const [historyError, setHistoryError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [copyingCode, setCopyingCode] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchVouchers();
    fetchHistory();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      setError("");

      const activePromos = await PromoAPI.getActivePromos();

      const transformedVouchers = activePromos.map((promo, index) => {
        let status = "active";
        let badge = "Active";

        if (promo.valid_until) {
          const expiryDate = new Date(promo.valid_until);
          const now = new Date();
          const daysUntilExpiry = Math.ceil(
            (expiryDate - now) / (1000 * 60 * 60 * 24),
          );

          if (daysUntilExpiry <= 7) {
            status = "expiring";
            badge = "Expiring Soon";
          }
        }

        let valueDisplay = "";
        if (promo.type === "percentage") {
          valueDisplay = `${promo.value}% OFF`;
        } else if (promo.type === "fixed") {
          valueDisplay = `$${promo.value} OFF`;
        } else if (promo.type === "shipping") {
          valueDisplay = "FREE SHIPPING";
        }

        const title =
          promo.description ||
          (promo.type === "percentage"
            ? `Get ${promo.value}% off your order`
            : promo.type === "fixed"
              ? `Save $${promo.value} on your purchase`
              : "Free shipping on eligible orders");

        let metaLabel = "Expires:";
        let metaValue = "";
        if (promo.valid_until) {
          const expiryDate = new Date(promo.valid_until);
          metaValue = expiryDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } else {
          metaValue = "No expiry date";
        }

        if (promo.min_order_amount > 0) {
          metaLabel = "Min order:";
          metaValue = `$${promo.min_order_amount}`;
        }

        return {
          id: promo.id || index + 1,
          value: valueDisplay,
          title: title,
          status: status,
          badge: badge,
          metaLabel: metaLabel,
          metaValue: metaValue,
          code: promo.code,
          type: promo.type,
          rawValue: promo.value,
          min_order_amount: promo.min_order_amount,
          valid_until: promo.valid_until,
        };
      });

      setVouchers(transformedVouchers);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError("Failed to load vouchers. Please try again.");
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      setHistoryError("");
      
      const data = await PromoAPI.getUserPromoHistory();
      setHistoryItems(data);
      
    } catch (error) {
      console.error("Error fetching history:", error);
      if (error.message === 'Please log in to view promo history') {
        setHistoryItems([]);
      } else {
        setHistoryError("Failed to load history");
        setHistoryItems([]);
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      setCopyingCode(code);
      await navigator.clipboard.writeText(code);

      setTimeout(() => {
        setCopyingCode(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopyingCode(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const hasVouchers = filteredVouchers.length > 0;
  const reachedVoucherEnd = filteredVouchers.length <= 4;

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="promo">
          <div className="promo__inner">
            <div className="promo__loading">
              <h2>Loading your vouchers...</h2>
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
              {error && <div className="promo__error">{error}</div>}
            </div>

            <div className="promo__search">
              <img src={SearchIcon} alt="" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search vouchers..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          <div className="promo__layout">
            <div className="promo__vouchers">
              {hasVouchers ? (
                <>
                  <div className="promo__grid">
                    {filteredVouchers.map((voucher) => (
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
                          {copyingCode === voucher.code ? (
                            <span className="promoCard__copied">Copied!</span>
                          ) : (
                            <button
                              className="promoCard__copy"
                              type="button"
                              onClick={() => handleCopyCode(voucher.code)}
                            >
                              <img src={CopyIcon} alt="" aria-hidden="true" />
                              Copy
                            </button>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  <button
                    className="promo__more"
                    type="button"
                    disabled={reachedVoucherEnd}
                  >
                    {reachedVoucherEnd
                      ? "You've reached the end of the promo codes"
                      : "Load More Vouchers"}
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
                {historyLoading ? (
                  <div className="promo__historyLoading">Loading history...</div>
                ) : historyError ? (
                  <div className="promo__historyError">{historyError}</div>
                ) : historyItems.length > 0 ? (
                  <div className="promo__history">
                    {historyItems.map((item) => (
                      <div className="promo__historyItem" key={item.id}>
                        <span
                          className={`promo__historyIcon promo__historyIcon--${item.tone}`}
                        >
                          <img src={item.icon || GrayCheck} alt="" aria-hidden="true" />
                        </span>
                        <div className="promo__historyBody">
                          <div className="promo__historyTitle">{item.title}</div>
                          <div className="promo__historyDesc">{item.desc}</div>
                          <div className="promo__historyDate">{item.date}</div>
                          {item.discount_amount && (
                            <div className="promo__historyDiscount">Saved {item.discount_amount}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="promo__historyEmpty">No promos used yet</p>
                )}
              </div>

              <div className="promo__card promo__card--help">
                <h3>Need Help?</h3>
                <p>
                  Having trouble with a voucher code? Our support team is here
                  to help you 24/7.
                </p>
                <Link className="promo__helpLink" to="/contact">
                  Contact Support <span aria-hidden="true">›</span>
                </Link>
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
