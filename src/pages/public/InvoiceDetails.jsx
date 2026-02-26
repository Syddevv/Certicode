import React, { useEffect, useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/InvoiceDetails.css";
import PrintIcon from "../../assets/PrintIcon.png";
import WhiteDownload from "../../assets/whiteDownload.png";
import BillingSupport from "../../assets/billingSupport.png";
import { downloadInvoicePdf } from "../../utils/invoicePdf";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const InvoiceDetails = () => {
  const { invoiceId } = useParams();
  const location = useLocation();
  const invoice = location.state?.invoice;
  const user = location.state?.user;

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const details = useMemo(() => {
    const purchase = invoice?.purchaseData || {};
    const product = purchase.product || {};

    const toNumber = (value) => {
      if (value === null || value === undefined) return null;
      if (typeof value === "number") return Number.isFinite(value) ? value : null;
      const cleaned = String(value).replace(/[^0-9.-]/g, "");
      const parsed = Number.parseFloat(cleaned);
      return Number.isFinite(parsed) ? parsed : null;
    };

    const formatCurrency = (value) => {
      const numberValue = toNumber(value);
      return `$${(numberValue ?? 0).toFixed(2)}`;
    };

    const purchaseDate =
      purchase.purchased_at ||
      purchase.created_at ||
      purchase.date ||
      purchase.paid_at;

    const issuedDate = purchaseDate
      ? new Date(purchaseDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : invoice?.date || "Unknown Date";

    const invoiceLabel = invoice?.id
      ? invoice.id
      : invoiceId
      ? `INV-${invoiceId.toUpperCase()}`
      : "INV-0000";

    const invoiceNumber = invoiceLabel.replace("#", "");

    const orderNumber =
      purchase.order_number ||
      purchase.order?.order_number ||
      purchase.order?.id ||
      purchase.id ||
      "N/A";

    const amountNumber =
      toNumber(purchase.total_amount) ??
      toNumber(purchase.amount) ??
      toNumber(purchase.price) ??
      toNumber(purchase.order?.total_amount) ??
      toNumber(invoice?.amount);

    const subtotalNumber =
      toNumber(purchase.order?.subtotal) ??
      toNumber(purchase.subtotal) ??
      amountNumber;

    const taxNumber =
      toNumber(purchase.order?.tax_amount) ?? toNumber(purchase.tax_amount) ?? 0;

    const discountNumber =
      toNumber(purchase.order?.discount_amount) ??
      toNumber(purchase.discount_amount) ??
      0;

    const totalNumber =
      toNumber(purchase.order?.total_amount) ??
      toNumber(purchase.total_amount) ??
      amountNumber ??
      0;

    const status =
      invoice?.status ||
      (purchase.license_key && purchase.license_key !== "" ? "Paid" : "Pending");

    const billedToName = user?.name || "Customer";
    const billedToCompany = user?.company_name;
    const billedToAddress = user?.company_address || user?.address;
    const billedToLine = [billedToCompany, billedToAddress]
      .filter(Boolean)
      .join(" \u2022 ");

    const productName = product.name || invoice?.asset || "Digital Asset";
    const productId =
      product.sku ||
      product.product_id ||
      product.id ||
      purchase.product_id ||
      "N/A";

    const licenseLabel =
      purchase.license_type ||
      purchase.license?.type ||
      purchase.license?.name ||
      "Commercial";

    return {
      invoiceLabel,
      invoiceNumber,
      orderNumber,
      issuedDate,
      status,
      billedToName,
      billedToLine,
      productName,
      productId,
      licenseLabel,
      subtotal: formatCurrency(subtotalNumber),
      tax: formatCurrency(taxNumber),
      discount: formatCurrency(Math.abs(discountNumber)),
      total: formatCurrency(totalNumber),
      hasInvoice: Boolean(invoice),
    };
  }, [invoice, invoiceId, user]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    try {
      const filename = downloadInvoicePdf({
        invoiceNumber: details.invoiceNumber,
        orderNumber: details.orderNumber,
        issuedDate: details.issuedDate,
        status: details.status,
        billedToName: details.billedToName,
        billedToLine: details.billedToLine,
        productName: details.productName,
        productId: details.productId,
        licenseLabel: details.licenseLabel,
        subtotal: details.subtotal,
        tax: details.tax,
        discount: details.discount,
        total: details.total,
      });
      showSuccessToast(`Print dialog opened for ${filename}. Choose "Save as PDF".`);
    } catch (error) {
      console.error("Invoice PDF download failed:", error);
      showErrorToast("Failed to download invoice PDF.");
    }
  };

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
              Invoice Details {details.invoiceLabel}
            </span>
          </div>

          <div className="invoice-details__header">
            <div>
              <div className="invoice-details__titleRow">
                <h1>Invoice Details</h1>
                <span className="invoice-details__status">{details.status}</span>
              </div>
              <p>
                {details.hasInvoice
                  ? "Manage your billing records and download asset certificates."
                  : "We could not load all invoice details for this link. Return to Billing & Invoices and reopen the invoice to see the full record."}
              </p>
            </div>
            <div className="invoice-details__actions">
              <button
                className="invoice-details__ghost"
                type="button"
                onClick={handlePrint}
              >
                <img src={PrintIcon} alt="" aria-hidden="true" />
                Print
              </button>
              <button
                className="invoice-details__primary"
                type="button"
                onClick={handleDownloadPdf}
              >
                <img src={WhiteDownload} alt="" aria-hidden="true" />
                Download PDF
              </button>
            </div>
          </div>

          <div className="invoice-details__card">
            <div className="invoice-details__meta">
              <div>
                <span>Invoice Number</span>
                <strong>{details.invoiceNumber}</strong>
              </div>
              <div>
                <span>Order Number</span>
                <strong>{details.orderNumber}</strong>
              </div>
              <div>
                <span>Date Issued</span>
                <strong>{details.issuedDate}</strong>
              </div>
            </div>

            <div className="invoice-details__parties">
              <div>
                <span>Billed To</span>
                <strong>{details.billedToName}</strong>
                <p>{details.billedToLine || "Billing address not provided."}</p>
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
                  <strong>{details.productName}</strong>
                  <span>Product ID: {details.productId}</span>
                </div>
                <span className="invoice-details__pill">
                  {details.licenseLabel}
                </span>
                <span>1</span>
                <span>{details.total}</span>
              </div>
            </div>

            <div className="invoice-details__totals">
              <div className="invoice-details__totalsRow">
                <span>Subtotal</span>
                <span>{details.subtotal}</span>
              </div>
              <div className="invoice-details__totalsRow">
                <span>VAT / Tax</span>
                <span>{details.tax}</span>
              </div>
              <div className="invoice-details__totalsRow">
                <span>Discount</span>
                <span>-{details.discount}</span>
              </div>
              <div className="invoice-details__totalsRow invoice-details__totalsRow--total">
                <span>Total Paid</span>
                <span>
                  {details.total} <small>USD</small>
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
