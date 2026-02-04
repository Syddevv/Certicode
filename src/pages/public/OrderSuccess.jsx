import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/OrderSuccess.css";
import Verified from "../../assets/Verified.png";
import WhiteCheck from "../../assets/WhiteCheck.png";
import DownloadIcon from "../../assets/Download.png";
import CerticodeLogo from "../../assets/certicodeicon.png";
import { CartAPI } from "../../services/CartAPI";

const OrderSuccess = () => {
  const [order, setOrder] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    fetchOrderData();
  }, []);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await CartAPI.getLatestOrder();
      
      if (result.success) {
        setOrder(result.order);
        setPurchases(result.purchases || []);
      } else {
        setError(result.message || "Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError(error.message || "Failed to load order details");
      
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }) + ' UTC';
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };


  // ~~~
  // const handleDownload = (purchase) => {
  //   // Implement download logic
  //   console.log('Download purchase:', purchase);
  //   alert(`Downloading ${purchase.product?.name || 'product'}...`);
  // };

  if (loading) {
    return (
      <div>
        <Navbar />
        <section className="success">
          <div className="success__inner">
            <div className="success__loading">
              <h2>Loading order details...</h2>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Navbar />
        <section className="success">
          <div className="success__inner">
            <div className="success__breadcrumb">
              <Link className="success__crumb" to="/marketplace">
                Marketplace
              </Link>
              <span className="success__sep">&rsaquo;</span>
              <span className="success__crumb success__crumb--active">
                Order Confirmation
              </span>
            </div>

            <div className="success__header">
              <h1>Order Details</h1>
              <div className="success__error">
                {error || "No order found"}
              </div>
              <Link className="success__action" to="/purchases">
                View All Purchases
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="success">
        <div className="success__inner">
          <div className="success__breadcrumb">
            <Link className="success__crumb" to="/cart">
              Your Cart
            </Link>
            <span className="success__sep">&rsaquo;</span>
            <span className="success__crumb success__crumb--active">
              Order Confirmation
            </span>
          </div>

          <div className="success__header">
            <div className="success__badge">
              <img src={Verified} alt="" aria-hidden="true" />
            </div>
            <h1>Payment Successful</h1>
            <p>
              Thank you for your purchase. Your asset{purchases.length > 1 ? 's are' : ' is'} ready for deployment.
            </p>
          </div>

          <div className="success__receipt">
            <div className="success__receiptTop">
              <img
                className="success__logo"
                src={CerticodeLogo}
                alt="certicode"
              />
              <div className="success__meta">
                <div>
                  <span>Date:</span> {formatDate(order.paid_at)}
                </div>
                <div>
                  <span>Time:</span> {formatTime(order.paid_at)}
                </div>
                <div>
                  <span>Order ID:</span> {order.order_number}
                </div>
              </div>
            </div>

            {purchases.map((purchase, index) => (
              <div key={index} className="success__item">
                <div className="success__thumb">
                  {purchase.product?.featured_image ? (
                    <img 
                      src={purchase.product.featured_image} 
                      alt={purchase.product.name}
                      className="success__thumbImage"
                    />
                  ) : purchase.product?.images?.[0] ? (
                    <img 
                      src={purchase.product.images[0]} 
                      alt={purchase.product.name}
                      className="success__thumbImage"
                    />
                  ) : (
                    <div className="success__thumbPlaceholder">
                      {purchase.product?.name?.charAt(0) || 'P'}
                    </div>
                  )}
                </div>
                <div className="success__itemBody">
                  <div className="success__itemTitle">
                    {purchase.product?.name || "Digital Asset"}
                  </div>
                  <div className="success__itemSub">Commercial License</div>
                  {purchase.license_key && (
                    <div className="success__licenseKey">
                      License: {purchase.license_key}
                    </div>
                  )}
                </div>
                <div className="success__itemPrice">
                  {formatCurrency(purchase.price)}
                </div>
              </div>
            ))}

            {purchases.length === 0 && order.items?.map((item, index) => (
              <div key={index} className="success__item">
                <div className="success__thumb" />
                <div className="success__itemBody">
                  <div className="success__itemTitle">
                    {item.product?.name || "Digital Asset"}
                  </div>
                  <div className="success__itemSub">Commercial License</div>
                </div>
                <div className="success__itemPrice">
                  {formatCurrency(item.price)}
                </div>
              </div>
            ))}

            <div className="success__rows">
              <div className="success__row">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="success__row">
                <span>VAT / Tax</span>
                <span>{formatCurrency(order.tax_amount)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="success__row">
                  <span>Discount</span>
                  <span>-{formatCurrency(order.discount_amount)}</span>
                </div>
              )}
            </div>

            <div className="success__divider" aria-hidden="true" />

            <div className="success__total">
              <span>Total Amount</span>
              <span className="success__price">
                {formatCurrency(order.total_amount)} <span>USD</span>
              </span>
            </div>

            <div className="success__status">
              <span className="success__card">
                {order.payment_method === 'card' ? 'Credit/Debit Card' : order.payment_method}
                {order.payment_intent_id ? ' • Processed' : ''}
              </span>
              <span className="success__secure">
                <img src={WhiteCheck} alt="" aria-hidden="true" />
                Secure
              </span>
            </div>

            <div className="success__notice">
              You now have instant access to your purchased asset{purchases.length > 1 ? 's' : ''}.
            </div>
          </div>

            {/* ~~~ */}
          {/* <button 
            className="success__download" 
            type="button"
            onClick={() => purchases.length > 0 && handleDownload(purchases[0])}
          >
            <img src={DownloadIcon} alt="" aria-hidden="true" />
            Download
          </button> */}

          <div className="success__actions">
            <Link
              className="success__action success__action--ghost"
              to="/marketplace"
            >
              Back to Marketplace
            </Link>
            <Link className="success__action" to="/purchases">
              Go to My Purchases
            </Link>
          </div>

          <p className="success__email">
            A copy of your receipt and license key{purchases.length > 1 ? 's' : ''} has been sent to{" "}
            <strong>{order.customer_email}</strong>
          </p>

          <div className="success__help">
            Need help with your purchase?{" "}
            <Link to="/contact">Contact Support</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;