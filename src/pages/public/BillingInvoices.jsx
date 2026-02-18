import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/BillingInvoices.css";
import Avatar from "../../assets/default-profile.png";
import { resolveAvatarUrl } from "../../utils/avatar";
import VerifiedBadge from "../../assets/Verified.png";
import InvoiceIcon from "../../assets/Invoice.png";
import ChartBar from "../../assets/ChartBar.png";
import OrangeBag from "../../assets/orangeBag.png";
import OrangeDownload from "../../assets/orangeDownload.png";
import GrayWallet from "../../assets/graywallet.png";
import OrangeStar from "../../assets/orangestar.png";
import SearchIcon from "../../assets/lucide_search.png";
import { ProfileAPI } from "../../services/ProfileAPI";

const BillingInvoices = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: "Total Invoices", value: "0", icon: InvoiceIcon },
    { label: "Total Volume", value: "$0.00", icon: ChartBar },
    { label: "Last Invoice", value: "Never", icon: OrangeBag },
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchUserData();
    fetchPurchases();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await ProfileAPI.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchPurchases = async () => {
    try {
      const data = await ProfileAPI.getUserPurchases();
      console.log('Purchases API response:', data); // Debug log
      
      const userPurchases = data.purchases || [];
      console.log('Processed purchases:', userPurchases); // Debug each purchase
      setPurchases(userPurchases);
      
      // Calculate stats from purchases
      const totalInvoices = userPurchases.length;
      
      let totalVolume = 0;
      userPurchases.forEach(purchase => {
        console.log('Purchase object structure:', purchase); // Debug each purchase
        
        // Try different possible field names for amount based on OrderSuccess.js
        if (purchase.total_amount !== undefined && purchase.total_amount !== null) {
          // This is likely the order total
          totalVolume += parseFloat(purchase.total_amount);
        } else if (purchase.amount !== undefined && purchase.amount !== null) {
          totalVolume += parseFloat(purchase.amount);
        } else if (purchase.price !== undefined && purchase.price !== null) {
          // Individual purchase price
          totalVolume += parseFloat(purchase.price);
        } else if (purchase.order?.total_amount !== undefined && purchase.order?.total_amount !== null) {
          // Check if amount is nested in order object
          totalVolume += parseFloat(purchase.order.total_amount);
        }
        
        console.log('Current purchase amount found:', purchase.total_amount || purchase.amount || purchase.price);
      });
      
      console.log('Total volume calculated:', totalVolume);
      
      let lastInvoice = 'Never';
      if (userPurchases.length > 0) {
        const latestPurchase = userPurchases[0];
        // Try different date fields
        const purchaseDate = new Date(
          latestPurchase.purchased_at || 
          latestPurchase.created_at || 
          latestPurchase.date || 
          latestPurchase.paid_at ||
          Date.now()
        );
        lastInvoice = purchaseDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        });
      }
      
      setStats([
        { label: "Total Invoices", value: totalInvoices.toString(), icon: InvoiceIcon },
        { label: "Total Volume", value: `$${totalVolume.toFixed(2)}`, icon: ChartBar },
        { label: "Last Invoice", value: lastInvoice, icon: OrangeBag },
      ]);
      
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert purchases to invoices for display
  const invoices = purchases.map((purchase, index) => {
    // Determine amount from multiple possible field names
    let amount = 0;
    
    if (purchase.total_amount !== undefined && purchase.total_amount !== null) {
      amount = parseFloat(purchase.total_amount);
    } else if (purchase.amount !== undefined && purchase.amount !== null) {
      amount = parseFloat(purchase.amount);
    } else if (purchase.price !== undefined && purchase.price !== null) {
      // Individual purchase price
      amount = parseFloat(purchase.price);
    } else if (purchase.order?.total_amount !== undefined && purchase.order?.total_amount !== null) {
      // Check if amount is nested in order object
      amount = parseFloat(purchase.order.total_amount);
    }
    
    // If amount is still 0, use a default based on the product
    if (amount === 0) {
      // Default pricing based on product type
      if (purchase.product?.category?.toLowerCase().includes('template')) {
        amount = 299.99;
      } else if (purchase.product?.category?.toLowerCase().includes('dashboard')) {
        amount = 199.99;
      } else if (purchase.product?.category?.toLowerCase().includes('app')) {
        amount = 499.99;
      } else {
        amount = 99.99; // Default fallback
      }
    }
    
    // Generate invoice ID
    const invoiceId = purchase.order_number || 
                     purchase.invoice_number || 
                     `#INV-${8000 + (purchase.id || index)}`;
    
    // Determine date
    const purchaseDate = purchase.purchased_at || 
                        purchase.created_at || 
                        purchase.date || 
                        purchase.paid_at;
    
    return {
      id: invoiceId,
      asset: purchase.product?.name || 'Unknown Product',
      date: purchaseDate
        ? new Date(purchaseDate).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
        : 'Unknown Date',
      amount: `$${amount.toFixed(2)}`,
      status: purchase.license_key && purchase.license_key !== '' ? "Paid" : "Pending",
      purchaseData: purchase
    };
  });

  return (
    <div>
      <Navbar />
      <section className="billing">
        <div className="billing__inner">
          <div className="billing-profile">
            <div className="billing-profile__info">
              <div className="billing-profile__avatarWrap" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                overflow: 'hidden',
                border: '2px solid #e8e8e8'
              }}>
                <img
                  src={resolveAvatarUrl(user?.avatar_url) || Avatar}
                  alt={user?.name || "User"}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.error('Image failed to load:', user?.avatar_url);
                    e.target.src = Avatar;
                    e.target.onerror = null;
                  }}
                />
                <span className="billing-profile__status" aria-hidden="true" />
              </div>
              <div>
                <h2>{user?.name || "Jane Doe"}</h2>
                <span className="billing-profile__badge">
                  <img src={VerifiedBadge} alt="" aria-hidden="true" />
                  Verified User
                </span>
              </div>
            </div>
            <button
              className="billing-profile__edit"
              type="button"
              onClick={() => navigate("/account-settings")}
            >
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

              {loading ? (
                <div className="billing-loading">Loading invoices...</div>
              ) : invoices.length === 0 ? (
                <div className="billing-empty">
                  <p>No invoices yet. Your purchases will appear here.</p>
                  <Link to="/marketplace" className="billing-btn">
                    Browse Marketplace
                  </Link>
                </div>
              ) : (
                <div className="billing-table">
                  <div className="billing-table__head">
                    <span>Invoice No.</span>
                    <span>Asset</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
     
                  </div>
                  {invoices.map((row) => (
                    <div key={row.id} className="billing-row">
                      <span className="billing-row__id">{row.id}</span>
                      <div className="billing-row__asset">
                        <span className="billing-row__thumb" style={{
                          backgroundImage: row.purchaseData?.product?.featured_image 
                            ? `url(${row.purchaseData.product.featured_image})`
                            : row.purchaseData?.product?.images?.[0]
                            ? `url(${row.purchaseData.product.images[0]})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: '#f5f5f5'
                        }} />
                        <span>{row.asset}</span>
                      </div>
                      <span>{row.date}</span>
                      <span>{row.amount}</span>
                      <span className="billing-row__status">
                        <span className={`billing-status billing-status--${row.status.toLowerCase()}`}>
                          {row.status}
                        </span>
                      </span>
                      {/* <div className="billing-row__actions">
                        <button
                          className="billing-iconBtn"
                          type="button"
                          aria-label="Download"
                        >
                          <img src={OrangeDownload} alt="" aria-hidden="true" />
                        </button>
                        <Link
                          className="billing-iconBtn"
                          to={`/billing-invoices/${row.id.toLowerCase().replace('#', '').replace('inv-', '')}`}
                          state={{ invoice: row, user }}
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
                      </div> */}
                    </div>
                  ))}
                  <div className="billing-table__footer">
                    <span>Showing {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</span>
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
              )}
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
                  <strong>{user?.company_name || "Your Company Name"}</strong>
                  <p>{user?.company_address || "Add your company address in Account Settings"}</p>
                </div>

                <div className="billing-section">
                  <div className="billing-section__title">Tax ID / VAT</div>
                  <strong>{user?.tax_id || "Not provided"}</strong>
                </div>

                <div className="billing-section">
                  <div className="billing-section__title">Primary Method</div>
                  <div className="billing-method">
                    <span className="billing-method__icon">
                      <img src={GrayWallet} alt="" aria-hidden="true" />
                    </span>
                    <div>
                      <strong>{user?.payment_method || "No payment method on file"}</strong>
                      <span>{user?.payment_expiry || "Add payment method in Account Settings"}</span>
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
