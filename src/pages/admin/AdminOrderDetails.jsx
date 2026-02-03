import React from "react";
import { Link } from "react-router-dom";
import "../../styles/adminOrderDetails.css";
import Sidebar from "../../components/Sidebar";
import AdminTopbar from "../../components/AdminTopbar";
import notifBell from "../../assets/NotifBell.png";

const Icons = {
  Download: "📥",
  Check: "✓",
  Dollar: "💲",
  Box: "📦",
  File: "📄"
};

const AdminOrderDetails = () => {
  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />

      <div className="layout">
        <Sidebar activePage="sales" />

        <main className="main">

          <div className="header-wrapper">
             <div className="breadcrumb">
                <Link to="/sales" className="breadcrumb-link">Orders</Link> 
                <span className="separator">›</span> 
                <span className="current">Order Details</span>
            </div>
            
            <div className="header-right">
                <span className="verified-badge"><span className="dot-green">●</span> Payment Verified</span>
                <button className="btn primary">
                   {Icons.Download} Download Invoice
                </button>
            </div>
          </div>

          <div className="order-details-layout">
            
            {/* LEFT COLUMN */}
            <div className="order-main-content">
              
              {/* ORDER SUMMARY */}
              <div className="card main-card">
                <div className="order-header-split">
                  <div>
                    <span className="label-sm">ORDER ID</span>
                    <h2>#ORD-2025-94210</h2>
                    <p className="meta-text">Placed on Dec 5, 2025 at 13:24 PM</p>
                  </div>
                  <div className="text-right">
                    <span className="label-sm">TOTAL AMOUNT</span>
                    <h2 className="price-large">$999.00</h2>
                    <span className="status-pill completed">● COMPLETED</span>
                  </div>
                </div>

                <div className="asset-section">
                    <h4 className="section-label">ASSET DETAILS</h4>
                    <div className="asset-box">
                        <div className="asset-icon-placeholder">❄️</div>
                        <div className="asset-info">
                            <h3>E-commerce SaaS Template</h3>
                            <p>Full Source Code License (Commercial)</p>
                            <div className="tags-row">
                                <span className="tag">REACT 18</span>
                                <span className="tag">NODE.JS</span>
                                <span className="tag">STRIPE</span>
                            </div>
                        </div>
                        <div className="asset-price">$999.00</div>
                    </div>
                </div>
              </div>

              {/* TRANSACTION HISTORY */}
              <div className="card">
                <h3 className="card-title">TRANSACTION HISTORY</h3>
                <div className="timeline-horizontal">
                    <div className="t-step">
                        <div className="t-icon orange">{Icons.Dollar}</div>
                        <div className="t-content">
                            <h4>Payment Received</h4>
                            <span>Dec 5, 2025 • 14:22</span>
                        </div>
                        <div className="t-line active"></div>
                    </div>
                    <div className="t-step">
                        <div className="t-icon orange">{Icons.Box}</div>
                        <div className="t-content">
                            <h4>Files Delivered</h4>
                            <span>Dec 5, 2025 • 14:23</span>
                        </div>
                        <div className="t-line active"></div>
                    </div>
                    <div className="t-step">
                        <div className="t-icon orange">{Icons.File}</div>
                        <div className="t-content">
                            <h4>License Generated</h4>
                            <span>Dec 5, 2025 • 14:25</span>
                        </div>
                        <div className="t-line active"></div>
                    </div>
                    <div className="t-step">
                        <div className="t-icon green">{Icons.Check}</div>
                        <div className="t-content">
                            <h4>Transaction Complete</h4>
                            <span>Finalized by System</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* PAYMENT METHOD - UPDATED */}
              <div className="card">
                <h3 className="card-title">PAYMENT METHOD</h3>
                <div className="payment-row">
                    <div className="visa-badge">VISA</div>
                    <div className="payment-details">
                        <strong>Visa Ending in 4242</strong>
                        <p>Auth Code: 8392-AX-392</p>
                    </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <aside className="order-sidebar">
              
              {/* CUSTOMER INFO */}
              <div className="card customer-card">
                <h3 className="card-title">CUSTOMER INFORMATION</h3>
                
                <div className="customer-header">
                  <img 
                    src="https://ui-avatars.com/api/?name=James+Wilson&background=FCD34D&color=fff&bold=true" 
                    alt="James Wilson" 
                    className="customer-avatar"
                  />
                  <div>
                    <h4>James Wilson</h4>
                    <p className="role-text">CTO, Enterprise Solutions Inc.</p>
                  </div>
                </div>

                <div className="info-group">
                    <label>EMAIL ADDRESS</label>
                    <a href="mailto:j.wilson@enterprisesol.com">j.wilson@enterprisesol.com</a>
                </div>

                <div className="info-group">
                    <label>BILLING ADDRESS</label>
                    <p>
                        128 Technology Drive<br />
                        Austin, TX 78701<br />
                        United States
                    </p>
                </div>

                <div className="info-group">
                    <label>TAX ID</label>
                    <p className="tax-text">VAT-US-9284-11</p>
                </div>

                <button className="btn-outline">View Customer Profile</button>
              </div>

              {/* REFUND */}
              <div className="refund-section">
                  <button className="btn-refund">
                    ↺ Refund Order
                  </button>
              </div>

              {/* SECURITY LOG - UPDATED */}
              <div className="card security-card">
                <h3 className="card-title">SECURITY LOG</h3>
                <div className="log-row">
                    <span className="log-label">IP Address</span>
                    <span className="log-value">192.168.1.44</span>
                </div>
                <div className="log-row">
                    <span className="log-label">Browser</span>
                    <span className="log-value">Chrome v118 (macOS)</span>
                </div>
                <div className="log-row">
                    <span className="log-label">Security Hash</span>
                    <span className="log-value">0x72...93a1</span>
                </div>
              </div>

            </aside>

          </div>
        </main>
      </div>
    </>
  );
};

export default AdminOrderDetails;