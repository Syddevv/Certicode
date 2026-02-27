import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Cart.css";
import AddToCart from "../../assets/AddToCart.png";
import CheckoutCart from "../../assets/CheckoutCart.png";
import NavCart from "../../assets/NavCart.png";
import CerticodeBoxIcon from "../../assets/CerticodeBoxIcon.png";
import { CartAPI } from "../../services/CartAPI";
import { PromoAPI } from "../../services/PromoAPI";
import { api } from "../../services/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [error, setError] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  
  const navigate = useNavigate();

  const getToneColor = (tech) => {
    const colorMap = {
      'React': 'blue',
      'Node.js': 'green',
      'Python': 'gold',
      'Django': 'green',
      'Flutter': 'purple',
      'Firebase': 'pink',
      'Swift': 'indigo',
      'Figma': 'rose',
      'Adobe XD': 'violet',
      'Tailwind': 'orange',
      'Laravel': 'red',
      'Vue.js': 'green',
      'HTML': 'orange',
      'CSS': 'blue',
      'JavaScript': 'yellow',
      'Stripe': 'violet',
    };
    
    return colorMap[tech] || 'green';
  };

  const fetchRecommendations = async () => {
    try {
      setRecommendationsLoading(true);
      
      if (cartItems.length > 0) {
        const randomCartItem = cartItems[Math.floor(Math.random() * cartItems.length)];
        
        if (randomCartItem.product?.asset_type) {
          const relatedResult = await api.getProducts("", randomCartItem.product.asset_type, 1);
          const related = relatedResult.data
            .filter(item => item.id !== randomCartItem.product_id)
            .slice(0, 4)
            .map(item => ({
              id: item.id,
              name: item.name,
              title: item.name,
              price: parseFloat(item.price),
              rating: item.rating || "4.2",
              vendor: "CertiCode",
              asset_type: item.asset_type,
              technologies: item.technologies || [],
              featured_image: item.featured_image,
              images: item.images || []
            }));
          setRecommendations(related);
        }
      } else {
        try {
          const featuredResult = await api.getProducts("", "", 1);
          const featured = featuredResult.data
            .slice(0, 4)
            .map(item => ({
              id: item.id,
              name: item.name,
              title: item.name,
              price: parseFloat(item.price),
              rating: item.rating || "4.2",
              vendor: "CertiCode",
              asset_type: item.asset_type,
              technologies: item.technologies || [],
              featured_image: item.featured_image,
              images: item.images || []
            }));
          setRecommendations(featured);
        } catch (featuredError) {
          console.error("Error fetching featured products:", featuredError);
          setRecommendations([
            { id: 1, title: "FoodieExpress Delivery App", price: 1499, rating: "4.2" },
            { id: 2, title: "Fintech Banking Dashboard", price: 450, rating: "4.5" },
            { id: 3, title: "Job Board Fullstack App", price: 799, rating: "4.9" },
            { id: 4, title: "AI Marketing Platform UI", price: 850, rating: "4.8" },
          ]);
        }
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendations([
        { id: 1, title: "FoodieExpress Delivery App", price: 1499, rating: "4.2" },
        { id: 2, title: "Fintech Banking Dashboard", price: 450, rating: "4.5" },
        { id: 3, title: "Job Board Fullstack App", price: 799, rating: "4.9" },
        { id: 4, title: "AI Marketing Platform UI", price: 850, rating: "4.8" },
      ]);
    } finally {
      setRecommendationsLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      setError("");
      
      const items = await CartAPI.getCart();
      setCartItems(items);
      calculateTotals(items);
      
      fetchRecommendations();
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response?.status === 401) {
        setError("Please login to view your cart");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(error.message || "Failed to load cart");
      }
      setCartItems([]);
      
      fetchRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (items) => {
    const subtotalAmount = items.reduce((sum, item) => {
      return sum + (parseFloat(item.product?.price) || 0);
    }, 0);
    
    const savedDiscount = localStorage.getItem('appliedDiscount');
    const currentDiscount = savedDiscount ? parseFloat(savedDiscount) : 0;
    
    setSubtotal(subtotalAmount);
    setDiscount(currentDiscount);
    setTotal(subtotalAmount - currentDiscount);
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      await CartAPI.removeFromCart(cartItemId);
      const updatedItems = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(updatedItems);
      calculateTotals(updatedItems);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    if (cartItems.length === 0) return;
    
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    
    try {
      await CartAPI.clearCart();
      localStorage.removeItem('appliedPromo');
      localStorage.removeItem('appliedDiscount');
      setCartItems([]);
      setSubtotal(0);
      setDiscount(0);
      setTotal(0);
      setAppliedPromo(null);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart");
    }
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code");
      return;
    }

    if (appliedPromo) {
      setPromoError("A promo code is already applied");
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError("");

      const productIds = cartItems
        .map((item) => item.product_id)
        .filter((id) => id !== null && id !== undefined && id !== "");
      
      const result = await PromoAPI.validatePromo(promoCode, subtotal, productIds);
      
      if (result.valid) {
        localStorage.setItem('appliedPromo', JSON.stringify(result.promo));
        localStorage.setItem('appliedDiscount', result.discount_amount.toString());
        localStorage.setItem('promoAppliedAt', Date.now().toString());
        
        setAppliedPromo(result.promo);
        setDiscount(result.discount_amount);
        setTotal(subtotal - result.discount_amount);
        setPromoError(`Promo code applied! ${result.message}`);
      } else {
        setPromoError(result.message || "Invalid promo code");
      }
    } catch (error) {
      console.error("Error applying promo:", error);
      setPromoError(error.message || "Failed to apply promo code");
    } finally {
      setPromoLoading(false);
    }
  };

  const applyMockPromo = () => {
    const mockPromos = {
      'SAVE10': { type: 'percentage', value: 10, min_amount: 0 },
      'SAVE20': { type: 'percentage', value: 20, min_amount: 100 },
      'FIXED50': { type: 'fixed', value: 50, min_amount: 200 },
      'FREESHIP': { type: 'shipping', value: 0, min_amount: 50 }
    };

    const promo = mockPromos[promoCode.toUpperCase()];
    
    if (!promo) {
      setPromoError("Invalid promo code");
      return;
    }

    if (subtotal < promo.min_amount) {
      setPromoError(`Minimum order of $${promo.min_amount} required`);
      return;
    }

    let discountAmount = 0;
    let message = "";

    if (promo.type === 'percentage') {
      discountAmount = subtotal * (promo.value / 100);
      message = `${promo.value}% discount applied!`;
    } else if (promo.type === 'fixed') {
      discountAmount = Math.min(promo.value, subtotal);
      message = `$${promo.value} discount applied!`;
    }

    const promoData = {
      code: promoCode.toUpperCase(),
      type: promo.type,
      value: promo.value,
      discount_amount: discountAmount
    };
    
    localStorage.setItem('appliedPromo', JSON.stringify(promoData));
    localStorage.setItem('appliedDiscount', discountAmount.toString());
    localStorage.setItem('promoAppliedAt', Date.now().toString());
    
    setAppliedPromo(promoData);
    setDiscount(discountAmount);
    setTotal(subtotal - discountAmount);
    setPromoError(message);
  };

  const handleRemovePromo = () => {
    localStorage.removeItem('appliedPromo');
    localStorage.removeItem('appliedDiscount');
    localStorage.removeItem('promoAppliedAt');
    
    setAppliedPromo(null);
    setDiscount(0);
    setTotal(subtotal);
    setPromoCode("");
    setPromoError("");
  };

  const handleAddRecommended = async (productId) => {
    try {
      await CartAPI.addToCart(productId);
      fetchCartItems();
      setError("Item added to cart!");
    } catch (error) {
      console.error("Error adding recommended item:", error);
      setError(error.message || "Failed to add item");
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }
    
    navigate("/checkout", { 
      state: { 
        appliedPromo,
        discount,
        subtotal,
        total 
      } 
    });
  };

  const handleViewAll = () => {
    navigate("/marketplace");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    
    const savedPromo = localStorage.getItem('appliedPromo');
    const savedDiscount = localStorage.getItem('appliedDiscount');
    const savedAt = localStorage.getItem('promoAppliedAt');
    
    if (savedPromo && savedAt) {
      const appliedTime = parseInt(savedAt);
      const currentTime = Date.now();
      const thirtyMinutes = 30 * 60 * 1000;
      
      if (currentTime - appliedTime > thirtyMinutes) {
        localStorage.removeItem('appliedPromo');
        localStorage.removeItem('appliedDiscount');
        localStorage.removeItem('promoAppliedAt');
      } else {
        setAppliedPromo(JSON.parse(savedPromo));
        setDiscount(savedDiscount ? parseFloat(savedDiscount) : 0);
      }
    }
    
    fetchCartItems();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      calculateTotals(cartItems);
    }
  }, [cartItems]);

  if (loading) {
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
            
            <div className="cart__loading">
              <h2>Loading your cart...</h2>
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
              <p>You have {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart.</p>
            </div>
            {cartItems.length > 0 && (
              <button 
                className="cart__clear" 
                type="button"
                onClick={handleClearCart}
              >
                Clear All
              </button>
            )}
          </div>

          {error && (
            <div className="cart__error">
              {error}
            </div>
          )}

          <div className="cart__layout">
            <div className="cart__items">
              {cartItems.length === 0 ? (
                <div className="cart__empty">
                  <h3>Your cart is empty</h3>
                  <p>Browse our marketplace to add items to your cart.</p>
                  <Link to="/marketplace" className="cart__continueShopping">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <article key={item.id} className="cart__item">
                    <div className="cart__media">
                      {item.product?.featured_image ? (
                        <img 
                          src={item.product.featured_image} 
                          alt={item.product.name}
                          className="cart__itemImage"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="cart__imagePlaceholder">Product</div>';
                          }}
                        />
                      ) : item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="cart__itemImage"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '';
                            e.target.parentElement.innerHTML = '<div class="cart__imagePlaceholder">Product</div>';
                          }}
                        />
                      ) : (
                        <div className="cart__imagePlaceholder">
                          {item.product?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                    </div>
                    <div className="cart__itemBody">
                      <div className="cart__itemHeader">
                        <div className="cart__tags">
                          {item.product?.technologies?.slice(0, 2).map((tech, index) => (
                            <span
                              key={index}
                              className={`cart__tag cart__tag--${getToneColor(tech)}`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="cart__price">
                          <span>${parseFloat(item.product?.price || 0).toFixed(2)}</span>
                          <span className="cart__currency">USD</span>
                        </div>
                      </div>

                      <h3 className="cart__itemTitle">
                        <Link to={`/marketplace/${item.product_id}`}>
                          {item.product?.name || "Product"}
                        </Link>
                      </h3>
                      <p className="cart__itemMeta">
                        {item.product?.asset_type || "Digital Asset"}
                        <span className="cart__dot">&bull;</span>
                        Version 1.0
                      </p>

                      <button 
                        className="cart__remove" 
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <aside className="cart__summary">
              <div className="cart__promo">
                <h3>Promo Code</h3>
                {appliedPromo ? (
                  <div className="cart__promoApplied">
                    <div className="cart__promoSuccess">
                      <span>✓ {appliedPromo.code} applied</span>
                      <button 
                        className="cart__removePromo"
                        onClick={handleRemovePromo}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="cart__promoDetails">
                      {appliedPromo.type === 'percentage' && (
                        <span>{appliedPromo.value}% off</span>
                      )}
                      {appliedPromo.type === 'fixed' && (
                        <span>${appliedPromo.value} off</span>
                      )}
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="cart__promoRow">
                      <input
                        className="cart__promoInput"
                        type="text"
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoLoading}
                      />
                      <button 
                        className="cart__apply" 
                        type="button"
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoCode.trim()}
                      >
                        {promoLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    {promoError && (
                      <div className={`cart__promoMessage ${promoError.includes("applied") || promoError.includes("!") ? "cart__promoMessage--success" : "cart__promoMessage--error"}`}>
                        {promoError}
                      </div>
                    )}
                  </>
                )}
                <Link className="cart__promoLink" to="/promo-codes">
                  View all promo codes
                </Link>
              </div>

              <div className="cart__summaryDetails">
                <h3>Order Summary</h3>
                <div className="cart__summaryRow">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cart__summaryRow">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
                <div className="cart__summaryDivider" aria-hidden="true" />
                <div className="cart__summaryRow cart__summaryRow--total">
                  <span>Total Amount</span>
                  <span>
                    ${total.toFixed(2)} <span className="cart__currency">USD</span>
                  </span>
                </div>
              </div>

              <button 
                className="cart__checkout" 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                <img src={CheckoutCart} alt="" aria-hidden="true" />
                Proceed to Checkout
              </button>
              <p className="cart__note">
                By proceeding, you agree to our{" "}
                <Link to="/terms">Terms &amp; Conditions</Link> and{" "}
                <Link to="/privacy-policy">Privacy Policy</Link>.
              </p>
            </aside>
          </div>

          {cartItems.length > 0 && (
            <section className="cart__recommendations">
              <div className="cart__recommendationsHeader">
                <div>
                  <h3>You may also like</h3>
                  <p>
                    Explore similar high-quality digital assets for your next
                    project.
                  </p>
                </div>
                <button 
                  className="cart__viewAll" 
                  type="button"
                  onClick={handleViewAll}
                >
                  View All
                </button>
              </div>

              {recommendationsLoading ? (
                <div className="cart__loadingRec">
                  <p>Loading recommendations...</p>
                </div>
              ) : (
                <div className="cart__recommendationsGrid">
                  {recommendations.map((item, index) => (
                    <article key={item.id || index} className="cart__recCard">
                      <div className="cart__recMedia">
                        {item.featured_image ? (
                          <img 
                            src={item.featured_image} 
                            alt={item.title || item.name}
                            className="cart__recImage"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                              e.target.parentElement.innerHTML = '<div class="cart__imagePlaceholder">' + (item.title?.charAt(0) || item.name?.charAt(0) || 'P') + '</div>';
                            }}
                          />
                        ) : item.images?.[0] ? (
                          <img 
                            src={item.images[0]} 
                            alt={item.title || item.name}
                            className="cart__recImage"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                              e.target.parentElement.innerHTML = '<div class="cart__imagePlaceholder">' + (item.title?.charAt(0) || item.name?.charAt(0) || 'P') + '</div>';
                            }}
                          />
                        ) : (
                          <div className="cart__imagePlaceholder">
                            {item.title?.charAt(0) || item.name?.charAt(0) || 'P'}
                          </div>
                        )}
                      </div>
                      <div className="cart__recBody">
                        <h4>
                          <Link to={`/marketplace/${item.id}`}>
                            {item.title || item.name}
                          </Link>
                        </h4>
                        <div className="cart__recMeta">
                          <span className="cart__recVendor">
                            <img src={CerticodeBoxIcon} alt="" />
                            {item.vendor || "CertiCode"}
                          </span>
                          <span className="cart__recPrice">${item.price?.toFixed(2) || "0.00"}</span>
                        </div>
                        <div className="cart__recDivider" aria-hidden="true" />
                        <div className="cart__recFooter">
                          <div className="cart__recRating">
                            <span className="cart__recStar">★</span>
                            <span>{item.rating || "4.0"}</span>
                          </div>
                          <button 
                            className="cart__recCart" 
                            type="button"
                            onClick={() => handleAddRecommended(item.id)}
                          >
                            <img src={AddToCart} alt="Add to cart" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Cart;
