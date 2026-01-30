import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../styles/OrderSuccess.css";
import Verified from "../../assets/Verified.png";
import WhiteCheck from "../../assets/WhiteCheck.png";
import DownloadIcon from "../../assets/Download.png";
import CerticodeLogo from "../../assets/certicodeicon.png";

const OrderSuccess = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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
              Thank you for your purchase. Your asset is ready for deployment.
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
                  <span>Date:</span> Jan 31, 2026
                </div>
                <div>
                  <span>Time:</span> 14:32:05 UTC
                </div>
                <div>
                  <span>Order ID:</span> ORD-99283-CX
                </div>
              </div>
            </div>

            <div className="success__item">
              <div className="success__thumb" />
              <div className="success__itemBody">
                <div className="success__itemTitle">
                  E-commerce SaaS Template
                </div>
                <div className="success__itemSub">Commercial License</div>
              </div>
              <div className="success__itemPrice">$999.00</div>
            </div>

            <div className="success__rows">
              <div className="success__row">
                <span>Subtotal</span>
                <span>$999.00</span>
              </div>
              <div className="success__row">
                <span>VAT / Tax</span>
                <span>$0.00</span>
              </div>
              <div className="success__row">
                <span>Discount</span>
                <span>-$0.00</span>
              </div>
            </div>

            <div className="success__divider" aria-hidden="true" />

            <div className="success__total">
              <span>Total Amount</span>
              <span className="success__price">
                $999.00 <span>USD</span>
              </span>
            </div>

            <div className="success__status">
              <span className="success__card">Visa ending in 4242</span>
              <span className="success__secure">
                <img src={WhiteCheck} alt="" aria-hidden="true" />
                Secure
              </span>
            </div>

            <div className="success__notice">
              You have now an instant access to your purchased asset.
            </div>
          </div>

          <button className="success__download" type="button">
            <img src={DownloadIcon} alt="" aria-hidden="true" />
            Download
          </button>

          <div className="success__actions">
            <Link className="success__action success__action--ghost" to="/marketplace">
              Back to Marketplace
            </Link>
            <Link className="success__action" to="/marketplace">
              Go to My Purchases
            </Link>
          </div>

          <p className="success__email">
            A copy of your receipt and license key has been sent to{" "}
            <strong>jane.doe@email.com</strong>
          </p>

          <div className="success__help">
            Need help with your purchase?{" "}
            <button type="button">Contact Support</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccess;
