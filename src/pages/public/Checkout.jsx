import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Checkout.css";
import WalletIcon from "../../assets/wallet2.png";
import GrayWallet from "../../assets/graywallet.png";
import Padlock from "../../assets/padlock.png";
import SafeLock from "../../assets/safelock.png";
import CustomerSupport from "../../assets/CustomerSupport.png";
import { CartAPI } from "../../services/CartAPI";
import { loadStripe } from "@stripe/stripe-js";
import {
   Elements,
   CardNumberElement,
   CardExpiryElement,
   CardCvcElement,
   useStripe,
   useElements
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51SuOSqBxaeRiDCkhh3cSl1fXqOcfJwRwM03TZlYXqYpqYBtBlaj0mNstAP2JlrFg8tEWvCvtJp4wP8SGsqLcbPWC00K7wU9ufv");
const CARD_ELEMENT_OPTIONS = {
  placeholder: "",
  style: {
    base: {
      color: "#111827",
      fontSize: "16px",
      "::placeholder": {
        color: "#9ca3af",
        fontSize: "12px",
      },
    },
    invalid: {
      color: "#ef4444",
    },
  },
};
const CARD_NUMBER_OPTIONS = {
  ...CARD_ELEMENT_OPTIONS,
  placeholder: "1234 1234 1234 1234",
};
const CARD_EXPIRY_OPTIONS = {
  ...CARD_ELEMENT_OPTIONS,
  placeholder: "MM / YY",
};
const CARD_CVC_OPTIONS = {
  ...CARD_ELEMENT_OPTIONS,
  placeholder: "123",
};

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState("");
  const [cardFields, setCardFields] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    country: "US",
    taxId: "",
    requestInvoice: false,
    streetAddress: "",
    city: "",
    postal: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  const getToneColor = (tech) => {
    const colorMap = {
      'React': 'blue', 'Node.js': 'green', 'Python': 'gold',
      'Django': 'green', 'Flutter': 'purple', 'Firebase': 'pink',
      'Swift': 'indigo', 'Figma': 'rose', 'Adobe XD': 'violet',
      'Tailwind': 'orange', 'Laravel': 'red', 'Vue.js': 'green',
      'HTML': 'orange', 'CSS': 'blue', 'JavaScript': 'yellow',
      'Stripe': 'violet',
    };
    return colorMap[tech] || 'green';
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const items = await CartAPI.getCart();
      
      if (!items || items.length === 0) {
        setError("Your cart is empty. Add items before checkout.");
        setCartItems([]);
        setLoading(false);
        return;
      }
      
      setCartItems(items);
      
      const subtotalAmount = items.reduce((sum, item) => {
        return sum + (parseFloat(item.product?.price) || 0);
      }, 0);
      
      setSubtotal(subtotalAmount);
      
      const taxAmount = subtotalAmount * 0.1;
      setTax(taxAmount);
      
      const savedPromo = localStorage.getItem('appliedPromo');
      const savedDiscount = localStorage.getItem('appliedDiscount');
      
      let discountAmount = savedDiscount ? parseFloat(savedDiscount) : 0;
      let promo = savedPromo ? JSON.parse(savedPromo) : null;
      
      setAppliedPromo(promo);
      setDiscount(discountAmount);
      
      const totalAmount = subtotalAmount + taxAmount - discountAmount;
      setTotal(totalAmount);
      
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Please login to checkout");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(error.message || "Failed to load cart");
      }
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCardElementChange = (field, event) => {
    setCardFields((prev) => {
      const next = { ...prev, [field]: event.complete };
      setCardComplete(next.number && next.expiry && next.cvc);
      return next;
    });

    if (event.error) {
      setCardError(event.error.message);
      setError(event.error.message);
    } else {
      setCardError("");
      setError("");
    }
  };


  const handleCompletePurchase = async () => {
    if (!formData.fullName.trim()) {
      setError("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email");
      return;
    }

    if (paymentMethod === 'card') {
      if (!stripe || !elements) {
        setError("Stripe is not loaded yet. Please wait.");
        return;
      }
      
      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) {
        setError("Card details are not complete");
        return;
      }
      
      if (!cardComplete) {
        setError("Please complete your card details");
        return;
      }
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setProcessingPayment(true);
      setError("");

      const checkoutData = {
        customer_info: {
          full_name: formData.fullName,
          email: formData.email,
          company_name: formData.companyName || null
        },
        billing_info: {
          country: formData.country,
          tax_id: formData.taxId || null,
          street_address: formData.streetAddress || null,
          city: formData.city || null,
          postal: formData.postal || null
        },
        payment_method: paymentMethod,
        promo_code: appliedPromo?.code || null,
        cart_items: cartItems.map(item => ({
          product_id: item.product_id,
          price: item.product?.price || 0
        })),
        subtotal: subtotal,
        tax_amount: tax,
        discount_amount: discount,
        total_amount: total
      };

      const result = await CartAPI.checkout(checkoutData);

      if (result.success) {
        localStorage.removeItem('appliedPromo');
        localStorage.removeItem('appliedDiscount');
        
        if (paymentMethod === 'card' && result.client_secret) {
          await handleStripePayment(result.client_secret, result.order_id, result.payment_intent_id);
        } else {
          navigate("/order-success");
        }
      } else {
        setError(result.message || "Checkout failed");
      }
    } catch (error) {
      setError(error.message || "Failed to process order. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleStripePayment = async (clientSecret, orderId, paymentIntentId) => {
    try {
      if (!stripe || !elements) {
        setError("Stripe is not loaded");
        return;
      }

      const cardElement = elements.getElement(CardNumberElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.fullName,
              email: formData.email,
              address: {
                line1: formData.streetAddress,
                city: formData.city,
                postal_code: formData.postal,
                country: formData.country
              }
            }
          }
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await CartAPI.confirmPayment(orderId, paymentIntent.id || paymentIntentId);
        
        localStorage.removeItem('appliedPromo');
        localStorage.removeItem('appliedDiscount');
        
        navigate("/order-success");
      } else if (paymentIntent.status === 'requires_action') {
        const { error: confirmError, paymentIntent: confirmedPaymentIntent } = 
          await stripe.confirmCardPayment(clientSecret);
          
        if (confirmError) {
          setError(confirmError.message);
        } else if (confirmedPaymentIntent.status === 'succeeded') {
          await CartAPI.confirmPayment(orderId, confirmedPaymentIntent.id);
          localStorage.removeItem('appliedPromo');
          localStorage.removeItem('appliedDiscount');
          navigate("/order-success");
        }
      } else {
        setError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (error) {
      setError("Payment processing failed");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchCartData();
  }, []);

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="checkout">
          <div className="checkout__inner">
            <div className="checkout__loading">
              <h2>Loading checkout...</h2>
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
            {error && <div className="checkout__error">{error}</div>}
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
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                  <label className="checkout__field">
                    <span>Email</span>
                    <input 
                      type="email" 
                      placeholder="johndoe@email.com" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </label>
                </div>
                <label className="checkout__field">
                  <span>Company Name (Optional)</span>
                  <input 
                    type="text" 
                    placeholder="Enter a legal company name" 
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
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
                    <select 
                      className="checkout__select"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                    </select>
                  </label>
                  <label className="checkout__field">
                    <span>VAT / Tax ID (Optional)</span>
                    <input 
                      type="text" 
                      placeholder="DE1233456789" 
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <label className="checkout__switch">
                  <input 
                    type="checkbox" 
                    name="requestInvoice"
                    checked={formData.requestInvoice}
                    onChange={handleInputChange}
                  />
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
                      <input 
                        type="text" 
                        placeholder="Street Address" 
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                      />
                    </label>
                    <div className="checkout__fields checkout__fields--two">
                      <label className="checkout__field">
                        <input 
                          type="text" 
                          placeholder="City" 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                        />
                      </label>
                      <label className="checkout__field">
                        <input 
                          type="text" 
                          placeholder="Postal" 
                          name="postal"
                          value={formData.postal}
                          onChange={handleInputChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              <section className="checkout__card">
                <div className="checkout__cardHeader">
                  <span className="checkout__step">3</span>
                  <h3>Payment Method</h3>
                  <img src={SafeLock} className="checkout__secureIcon" alt="" aria-hidden="true" />
                </div>
              
                <div className={`checkout__payOption ${paymentMethod === 'card' ? 'checkout__payOption--active' : ''}`}
                     onClick={() => handlePaymentMethodChange('card')}>
                  <div className="checkout__payTop">
                    <div className="checkout__payLeft">
                      <span className={`checkout__radio ${paymentMethod === 'card' ? 'checkout__radio--active' : ''}`} />
                      <div>
                        <div className="checkout__payTitle">Credit / Debit Card</div>
                        <div className="checkout__paySub">Visa, Master Card, Amex</div>
                      </div>
                    </div>
                    <img src={WalletIcon} alt="" aria-hidden="true" />
                  </div>
                  
                  {paymentMethod === 'card' && (
                    <div className="checkout__payFields">
                      <div className="checkout__stripeContainer">
                        <label className="checkout__field">
                          <span>Card Number</span>
                          <div className="checkout__stripeInput">
                            <CardNumberElement
                              options={CARD_NUMBER_OPTIONS}
                              onChange={(event) => handleCardElementChange("number", event)}
                              className="checkout__cardElement"
                            />
                            <img src={Padlock} alt="" aria-hidden="true" className="checkout__inlineLock" />
                          </div>
                        </label>
                        <div className="checkout__fields checkout__fields--two">
                          <label className="checkout__field">
                            <span>Expiry</span>
                            <div className="checkout__stripeInput">
                              <CardExpiryElement
                                options={CARD_EXPIRY_OPTIONS}
                                onChange={(event) => handleCardElementChange("expiry", event)}
                                className="checkout__cardElement"
                              />
                            </div>
                          </label>
                          <label className="checkout__field">
                            <span>CVC</span>
                            <div className="checkout__stripeInput">
                              <CardCvcElement
                                options={CARD_CVC_OPTIONS}
                                onChange={(event) => handleCardElementChange("cvc", event)}
                                className="checkout__cardElement"
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                      {cardError && <div className="checkout__cardError">{cardError}</div>}
                    </div>
                  )}
                </div>

                <div className={`checkout__payOption ${paymentMethod === 'paypal' ? 'checkout__payOption--active' : ''}`}
                     onClick={() => handlePaymentMethodChange('paypal')}>
                  <div className="checkout__payTop">
                    <div className="checkout__payLeft">
                      <span className={`checkout__radio ${paymentMethod === 'paypal' ? 'checkout__radio--active' : ''}`} />
                      <div>
                        <div className="checkout__payTitle">PayPal</div>
                        <div className="checkout__paySub">Fast and secure checkout</div>
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
                
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout__summaryItem">
                    <div className="checkout__thumb">
                      {item.product?.featured_image ? (
                        <img 
                          src={item.product.featured_image} 
                          alt={item.product.name}
                          className="checkout__thumbImage"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="checkout__thumbPlaceholder">' + 
                              (item.product?.name?.charAt(0) || 'P') + '</div>';
                          }}
                        />
                      ) : item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="checkout__thumbImage"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="checkout__thumbPlaceholder">' + 
                              (item.product?.name?.charAt(0) || 'P') + '</div>';
                          }}
                        />
                      ) : (
                        <div className="checkout__thumbPlaceholder">
                          {item.product?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="checkout__summaryTitle">
                        {item.product?.name || "Product"}
                      </div>
                      <div className="checkout__summarySub">
                        {item.product?.asset_type || "Digital Asset"} • Version 1.0
                      </div>
                      <div className="checkout__tags">
                        {item.product?.technologies?.slice(0, 2).map((tech, index) => (
                          <span 
                            key={index}
                            className={`checkout__tag checkout__tag--${getToneColor(tech)}`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="checkout__summaryRows">
                  <div className="checkout__row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="checkout__row">
                    <span>VAT / Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="checkout__row">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="checkout__divider" aria-hidden="true" />

                <div className="checkout__total">
                  <span>Total Amount</span>
                  <span className="checkout__price">
                    ${total.toFixed(2)} <span>USD</span>
                  </span>
                </div>

                <button 
                  className="checkout__cta" 
                  type="button"
                  onClick={handleCompletePurchase}
                  disabled={processingPayment || cartItems.length === 0 || (paymentMethod === 'card' && !cardComplete)}
                >
                  {processingPayment ? "Processing..." : "Complete Purchase"} 
                  <span aria-hidden="true">›</span>
                </button>

                <p className="checkout__note">
                  By clicking "Complete Purchase" you agree to the{" "}
                  <Link to="/terms">Enterprise License Agreement</Link>. Instant
                  access to all assets after successful payment.
                </p>
              </div>

              <Link className="checkout__sideCard" to="/contact">
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
              </Link>

              <div className="checkout__sideCard checkout__sideCard--help">
                <div>
                  <div className="checkout__sideTitle">Need Help?</div>
                  <div className="checkout__sideDesc">
                    Payment processing usually takes a few moments. If you have
                    questions about payment or billing, visit our Help Center.
                  </div>
                  <Link className="checkout__sideLink" to="/contact">
                    Contact Support <span aria-hidden="true">›</span>
                  </Link>
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

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Checkout />
    </Elements>
  );
};

export default CheckoutWrapper;
