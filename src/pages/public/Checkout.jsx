import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Checkout.css";
import WalletIcon from "../../assets/wallet2.png";
import GrayWallet from "../../assets/graywallet.png";
import Padlock from "../../assets/padlock.png";
import SafeLock from "../../assets/safelock.png";
import CustomerSupport from "../../assets/CustomerSupport.png";

const Checkout = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="checkout">
        <div className="checkout__inner">
          <div className="checkout__breadcrumb">
            <Link className="checkout__crumb" to="/cart">
              Your Cart
            </Link>
            <span className="checkout__sep">&rsaquo;</span>
            <span className="checkout__crumb checkout__crumb--active">
              Checkout
            </span>
          </div>

          <div className="checkout__header">
            <h1>Checkout</h1>
          </div>

          <div className="checkout__layout">
            <div className="checkout__main">
              <section className="checkout__card">
                <div className="checkout__cardHeader">
                  <span className="checkout__step">1</span>
                  <h3>Customer Information</h3>
                </div>

                <div className="checkout__fields checkout__fields--two">
                  <label className="checkout__field">
                    <span>Full Name</span>
                    <input type="text" placeholder="e.g. John Doe" />
                  </label>
                  <label className="checkout__field">
                    <span>Email</span>
                    <input type="email" placeholder="johndoe@email.com" />
                  </label>
                </div>

                <label className="checkout__field">
                  <span>Company Name (Optional)</span>
                  <input type="text" placeholder="Enter a legal company name" />
                </label>
              </section>

              <section className="checkout__card">
                <div className="checkout__cardHeader">
                  <span className="checkout__step">2</span>
                  <h3>Billing Details</h3>
                  <span className="checkout__badge">B2B Verified</span>
                </div>

                <div className="checkout__fields checkout__fields--two">
                  <label className="checkout__field">
                    <span>Country</span>
                    <div className="checkout__select">
                      <span>United States</span>
                      <span className="checkout__chevron">›</span>
                    </div>
                  </label>
                  <label className="checkout__field">
                    <span>VAT / Tax ID (Optional)</span>
                    <input type="text" placeholder="DE1233456789" />
                  </label>
                </div>

                <label className="checkout__switch">
                  <input type="checkbox" />
                  <span className="checkout__slider" />
                  <span className="checkout__switchLabel">
                    Request formal tax invoice
                  </span>
                </label>

                <div className="checkout__subcard">
                  <div className="checkout__subLabel">
                    BILLING ADDRESS FOR INVOICE
                  </div>
                  <div className="checkout__fields checkout__fields--stack">
                    <label className="checkout__field">
                      <input type="text" placeholder="Street Address" />
                    </label>
                    <div className="checkout__fields checkout__fields--two">
                      <label className="checkout__field">
                        <input type="text" placeholder="City" />
                      </label>
                      <label className="checkout__field">
                        <input type="text" placeholder="Postal" />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="checkout__card">
                <div className="checkout__cardHeader">
                  <span className="checkout__step">3</span>
                  <h3>Payment Method</h3>
                  <img
                    src={SafeLock}
                    className="checkout__secureIcon"
                    alt=""
                    aria-hidden="true"
                  />
                </div>

                <div className="checkout__payOption checkout__payOption--active">
                  <div className="checkout__payTop">
                    <div className="checkout__payLeft">
                      <span className="checkout__radio checkout__radio--active" />
                      <div>
                        <div className="checkout__payTitle">
                          Credit / Debit Card
                        </div>
                        <div className="checkout__paySub">
                          Visa, Master Card, Amex
                        </div>
                      </div>
                    </div>
                    <img src={WalletIcon} alt="" aria-hidden="true" />
                  </div>

                  <div className="checkout__payFields">
                    <label className="checkout__field">
                      <span>Card Number</span>
                      <div className="checkout__inputIcon">
                        <input type="text" placeholder="0000 0000 0000 0000" />
                        <img src={Padlock} alt="" aria-hidden="true" />
                      </div>
                    </label>
                    <div className="checkout__fields checkout__fields--two">
                      <label className="checkout__field">
                        <span>Expiry</span>
                        <input type="text" placeholder="MM/YY" />
                      </label>
                      <label className="checkout__field">
                        <span>CVC</span>
                        <input type="text" placeholder="123" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="checkout__payOption">
                  <div className="checkout__payTop">
                    <div className="checkout__payLeft">
                      <span className="checkout__radio" />
                      <div>
                        <div className="checkout__payTitle">PayPal</div>
                        <div className="checkout__paySub">
                          Fast and secure checkout
                        </div>
                      </div>
                    </div>
                    <img src={GrayWallet} alt="" aria-hidden="true" />
                  </div>
                </div>
              </section>

              <Link className="checkout__back" to="/marketplace">
                &lsaquo; Back to Marketplace
              </Link>
            </div>

            <aside className="checkout__aside">
              <div className="checkout__summary">
                <h3>Order Summary</h3>
                <div className="checkout__summaryItem">
                  <div className="checkout__thumb" />
                  <div>
                    <div className="checkout__summaryTitle">
                      E-commerce SaaS Template
                    </div>
                    <div className="checkout__summarySub">
                      SaaS Template • v2.4.1
                    </div>
                    <div className="checkout__tags">
                      <span>React</span>
                      <span>Node.js</span>
                    </div>
                  </div>
                </div>

                <div className="checkout__summaryRows">
                  <div className="checkout__row">
                    <span>Subtotal</span>
                    <span>$999.00</span>
                  </div>
                  <div className="checkout__row">
                    <span>VAT / Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="checkout__row">
                    <span>Discount</span>
                    <span>-$0.00</span>
                  </div>
                </div>

                <div className="checkout__divider" aria-hidden="true" />

                <div className="checkout__total">
                  <span>Total Amount</span>
                  <span className="checkout__price">
                    $999.00 <span>USD</span>
                  </span>
                </div>

                <Link to="/order-success">
                  <button className="checkout__cta" type="button">
                    Complete Purchase <span aria-hidden="true">›</span>
                  </button>
                </Link>

                <p className="checkout__note">
                  By clicking "Complete Purchase" you agree to the{" "}
                  <Link to="/terms">Enterprise License Agreement</Link>. Instant
                  access to all assets after successful payment.
                </p>
              </div>

              <div className="checkout__sideCard">
                <div className="checkout__sideIcon">
                  <img src={CustomerSupport} alt="" aria-hidden="true" />
                </div>
                <div>
                  <div className="checkout__sideTitle">Priority Help Desk</div>
                  <div className="checkout__sideDesc">
                    Purchasing for a team? Contact our licensing experts for
                    multi-seat discounts and deployment help.
                  </div>
                </div>
                <span className="checkout__sideArrow">›</span>
              </div>

              <div className="checkout__sideCard checkout__sideCard--help">
                <div>
                  <div className="checkout__sideTitle">Need Help?</div>
                  <div className="checkout__sideDesc">
                    Payment processing usually takes a few moments. If you have
                    questions about payment or billing, visit our Help Center.
                  </div>
                  <button className="checkout__sideLink" type="button">
                    Contact Support <span aria-hidden="true">›</span>
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;
