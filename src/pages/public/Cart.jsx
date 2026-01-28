import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Cart.css";
import AddToCart from "../../assets/AddToCart.png";
import CheckoutCart from "../../assets/CheckoutCart.png";
import NavCart from "../../assets/NavCart.png";
import CerticodeBoxIcon from "../../assets/CerticodeBoxIcon.png";

const cartItems = [
  {
    title: "E-commerce SaaS Template",
    subtitle: "SaaS Template",
    version: "v2.4.1",
    price: "$999.00",
    currency: "USD",
    tags: [
      { label: "Node.js", tone: "green" },
      { label: "React", tone: "blue" },
    ],
  },
];

const recommendations = [
  { title: "FoodieExpress Delivery App", price: "$1,499", rating: "4.2" },
  { title: "Fintech Banking Dashboard", price: "$450", rating: "4.5" },
  { title: "Job Board Fullstack App", price: "$799", rating: "4.9" },
  { title: "AI Marketing Platform UI", price: "$850", rating: "4.8" },
];

const Cart = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="cart">
        <div className="cart__inner">
          <div className="cart__breadcrumb">
            <Link className="cart__crumb" to="/marketplace">
              Marketplace
            </Link>
            <span className="cart__sep">&rsaquo;</span>
            <span className="cart__crumb cart__crumb--active">Your Cart</span>
          </div>

          <div className="cart__header">
            <div className="cart__titleGroup">
              <div className="cart__titleRow">
                <img src={NavCart} alt="" aria-hidden="true" />
                <h1>Your Cart</h1>
              </div>
              <p>You have 1 item in your cart.</p>
            </div>
            <button className="cart__clear" type="button">
              Clear All
            </button>
          </div>

          <div className="cart__layout">
            <div className="cart__items">
              {cartItems.map((item) => (
                <article key={item.title} className="cart__item">
                  <div className="cart__media" />
                  <div className="cart__itemBody">
                    <div className="cart__itemHeader">
                      <div className="cart__tags">
                        {item.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={`cart__tag cart__tag--${tag.tone}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <div className="cart__price">
                        <span>{item.price}</span>
                        <span className="cart__currency">{item.currency}</span>
                      </div>
                    </div>

                    <h3 className="cart__itemTitle">{item.title}</h3>
                    <p className="cart__itemMeta">
                      {item.subtitle} <span className="cart__dot">&bull;</span>{" "}
                      {item.version}
                    </p>

                    <button className="cart__remove" type="button">
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart__summary">
              <div className="cart__promo">
                <h3>Promo Code</h3>
                <div className="cart__promoRow">
                  <input
                    className="cart__promoInput"
                    type="text"
                    placeholder="Enter promo code"
                  />
                  <button className="cart__apply" type="button">
                    Apply
                  </button>
                </div>
                <Link className="cart__promoLink" to="/promo-codes">
                  View promo codes
                </Link>
              </div>

              <div className="cart__summaryDetails">
                <h3>Order Summary</h3>
                <div className="cart__summaryRow">
                  <span>Subtotal</span>
                  <span>$999.00</span>
                </div>
                <div className="cart__summaryRow">
                  <span>Discount</span>
                  <span>-$0.00</span>
                </div>
                <div className="cart__summaryDivider" aria-hidden="true" />
                <div className="cart__summaryRow cart__summaryRow--total">
                  <span>Total Amount</span>
                  <span>
                    $999.00 <span className="cart__currency">USD</span>
                  </span>
                </div>
              </div>

              <Link className="cart__checkout" to="/checkout">
                <img src={CheckoutCart} alt="" aria-hidden="true" />
                Proceed to Checkout
              </Link>
              <p className="cart__note">
                By proceeding, you agree to our{" "}
                <Link to="/terms">Terms &amp; Conditions</Link> and{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </aside>
          </div>

          <section className="cart__recommendations">
            <div className="cart__recommendationsHeader">
              <div>
                <h3>You may also like</h3>
                <p>
                  Explore similar high-quality digital assets for your next
                  project.
                </p>
              </div>
              <button className="cart__viewAll" type="button">
                View All
              </button>
            </div>

            <div className="cart__recommendationsGrid">
              {recommendations.map((item) => (
                <article key={item.title} className="cart__recCard">
                  <div className="cart__recMedia" />
                  <div className="cart__recBody">
                    <h4>{item.title}</h4>
                    <div className="cart__recMeta">
                      <span className="cart__recVendor">
                        <img src={CerticodeBoxIcon} alt="" />
                        CertiCode
                      </span>
                      <span className="cart__recPrice">{item.price}</span>
                    </div>
                    <div className="cart__recDivider" aria-hidden="true" />
                    <div className="cart__recFooter">
                      <div className="cart__recRating">
                        <span className="cart__recStar">&#9733;</span>
                        <span>{item.rating}</span>
                      </div>
                      <button className="cart__recCart" type="button">
                        <img src={AddToCart} alt="Add to cart" />
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

export default Cart;
