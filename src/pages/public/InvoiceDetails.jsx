import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/InvoiceDetails.css";
import PrintIcon from "../../assets/PrintIcon.png";
import WhiteDownload from "../../assets/whiteDownload.png";
import BillingSupport from "../../assets/billingSupport.png";

const InvoiceDetails = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <div>
      <Navbar />
      <section className="invoice-details">
        <div className="invoice-details__inner">
          <div className="invoice-details__breadcrumb">
            <Link className="invoice-details__crumb" to="/billing-invoices">
              Billing &amp; Invoices
            </Link>
            <span className="invoice-details__sep">›</span>
            <span className="invoice-details__crumb invoice-details__crumb--active">
              Invoice Details #INV-8273
            </span>
          </div>

          <div className="invoice-details__header">
            <div>
              <div className="invoice-details__titleRow">
                <h1>Invoice Details</h1>
                <span className="invoice-details__status">Paid</span>
              </div>
              <p>
                Manage your billing records and download asset certificates.
              </p>
            </div>
            <div className="invoice-details__actions">
              <button className="invoice-details__ghost" type="button">
                <img src={PrintIcon} alt="" aria-hidden="true" />
                Print
              </button>
              <button className="invoice-details__primary" type="button">
                <img src={WhiteDownload} alt="" aria-hidden="true" />
                Download PDF
              </button>
            </div>
          </div>

          <div className="invoice-details__card">
            <div className="invoice-details__meta">
              <div>
                <span>Invoice Number</span>
                <strong>INV-8273</strong>
              </div>
              <div>
                <span>Order Number</span>
                <strong>ORD-99283-CX</strong>
              </div>
              <div>
                <span>Date Issued</span>
                <strong>Jan 31, 2026</strong>
              </div>
            </div>

            <div className="invoice-details__parties">
              <div>
                <span>Billed To</span>
                <strong>Jane Doe</strong>
                <p>
                  Horizon Tech Solutions LLC • 452 Market Street, Ste 1200, San
                  Francisco, CA 94104
                </p>
              </div>
              <div>
                <span>Issued By</span>
                <strong>Certicode Marketplace Ltd.</strong>
                <p>
                  UNIT415 4/F VGP Center, 6772 Ayala Ave., San Lorenzo, Makati
                  City, Makati, Philippines, 1223
                </p>
              </div>
            </div>

            <div className="invoice-details__table">
              <div className="invoice-details__tableHead">
                <span>Asset Name</span>
                <span>License</span>
                <span>Qty</span>
                <span>Price</span>
              </div>
              <div className="invoice-details__tableRow">
                <div>
                  <strong>E-commerce SaaS Template</strong>
                  <span>Product ID: SKU-ECO-442</span>
                </div>
                <span className="invoice-details__pill">Commercial</span>
                <span>1</span>
                <span>$999.00</span>
              </div>
            </div>

            <div className="invoice-details__totals">
              <div className="invoice-details__totalsRow">
                <span>Subtotal</span>
                <span>$999.00</span>
              </div>
              <div className="invoice-details__totalsRow">
                <span>VAT / Tax</span>
                <span>$0.00</span>
              </div>
              <div className="invoice-details__totalsRow">
                <span>Discount</span>
                <span>-$0.00</span>
              </div>
              <div className="invoice-details__totalsRow invoice-details__totalsRow--total">
                <span>Total Paid</span>
                <span>
                  $999.00 <small>USD</small>
                </span>
              </div>
            </div>
          </div>

          <div className="invoice-details__support">
            <div>
              <div className="invoice-details__supportTitle">
                <img src={BillingSupport} alt="" aria-hidden="true" />
                <h4>Need help with this invoice?</h4>
              </div>
              <p>
                If you have questions regarding license terms, tax compliance,
                or billing errors, our specialized support team is ready to
                assist you.
              </p>
            </div>
            <Link className="invoice-details__ghost" to="/contact">
              Contact Billing Support
            </Link>
          </div>

          <div className="invoice-details__footerNote">
            This invoice is a valid tax document generated electronically by
            Certicode Marketplace.
            <span>© 2026 Certicode Marketplace Ltd. All rights reserved.</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default InvoiceDetails;
