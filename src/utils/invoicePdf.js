const cleanText = (value) =>
  String(value ?? "")
    .replace(/[^\x20-\x7E\n]/g, " ")
    .trim();

const escapeHtml = (value) =>
  cleanText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toFilename = (value) =>
  cleanText(value || "invoice")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");

const renderMultiline = (value, fallback = "") => {
  const source = cleanText(value || fallback);
  if (!source) return "";
  return source
    .split(/\n+/)
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
};

export const downloadInvoicePdf = (invoiceDetails = {}) => {
  const {
    invoiceNumber = "INV-0000",
    orderNumber = "N/A",
    issuedDate = "Unknown Date",
    status = "Pending",
    billedToName = "Customer",
    billedToLine = "Billing address not provided.",
    productName = "Digital Asset",
    productId = "N/A",
    licenseLabel = "Commercial",
    subtotal = "$0.00",
    tax = "$0.00",
    discount = "$0.00",
    total = "$0.00",
  } = invoiceDetails;

  const normalizedStatus = cleanText(status);
  const isPaid = /paid|completed|success/i.test(normalizedStatus);
  const filename = `${toFilename(invoiceNumber)}.pdf`;

  const printWindow = window.open("", "_blank", "width=960,height=1080");
  if (!printWindow) {
    throw new Error("Popup blocked. Please allow popups to export PDF.");
  }

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(filename)}</title>
    <style>
      @page { size: A4; margin: 10mm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #eef0f5; color: #0f172a; font-family: "Segoe UI", Arial, sans-serif; }
      .page {
        width: 100%;
        max-width: 820px;
        margin: 0 auto;
        background: #eef0f5;
        padding: 14px 12px 18px;
      }
      .topbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 4px 16px;
        border-bottom: 1px solid #d8dde8;
        margin-bottom: 18px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 800;
        font-size: 23px;
        letter-spacing: -0.02em;
        color: #111827;
      }
      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 8px;
        position: relative;
        background:
          radial-gradient(circle at 20% 20%, #ff7a1a 0 10%, transparent 11%),
          radial-gradient(circle at 80% 20%, #111827 0 10%, transparent 11%),
          radial-gradient(circle at 20% 80%, #111827 0 10%, transparent 11%),
          radial-gradient(circle at 80% 80%, #ff7a1a 0 10%, transparent 11%),
          linear-gradient(90deg, #111827 0 38%, transparent 38% 62%, #111827 62% 100%);
      }
      .top-icons {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .icon {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #d8dde8;
        color: #64748b;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        background: #fff;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        line-height: 1.2;
        letter-spacing: -0.02em;
      }
      .header p {
        margin: 8px 0 0;
        color: #667085;
        font-size: 14px;
      }
      .status-badge {
        display: inline-flex;
        align-items: center;
        margin-left: 10px;
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 700;
        color: ${isPaid ? "#16a34a" : "#b45309"};
        background: ${isPaid ? "#dcfce7" : "#fef3c7"};
        vertical-align: middle;
      }
      .card {
        margin-top: 18px;
        background: #fff;
        border: 1px solid #d8dde8;
        border-radius: 18px;
        overflow: hidden;
      }
      .meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        border-bottom: 1px solid #e4e7ec;
      }
      .meta-item {
        padding: 18px 18px 20px;
        min-height: 84px;
      }
      .meta-item + .meta-item {
        border-left: 1px solid #e4e7ec;
      }
      .label {
        display: block;
        color: #98a2b3;
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        margin-bottom: 10px;
      }
      .value {
        font-size: 14px;
        font-weight: 700;
        color: #111827;
      }
      .party-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
        padding: 18px;
      }
      .party strong {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .party p {
        margin: 0;
        font-size: 13px;
        line-height: 1.45;
        color: #667085;
      }
      .party p span {
        display: block;
      }
      .line-items {
        margin: 0 18px 18px;
        border: 1px solid #e4e7ec;
        border-radius: 14px;
        overflow: hidden;
      }
      .line-head, .line-row {
        display: grid;
        grid-template-columns: minmax(0, 1.8fr) 0.6fr 0.35fr 0.55fr;
        align-items: center;
      }
      .line-head {
        background: #f8fafc;
        color: #98a2b3;
        font-size: 11px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        padding: 12px 16px;
      }
      .line-row {
        padding: 14px 16px;
        border-top: 1px solid #eef2f7;
        font-size: 14px;
        color: #475467;
      }
      .line-row .asset strong {
        display: block;
        color: #111827;
        font-size: 14px;
        margin-bottom: 4px;
      }
      .line-row .asset small {
        color: #98a2b3;
        font-size: 12px;
      }
      .pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 5px 10px;
        border-radius: 999px;
        background: #f2f4f7;
        color: #667085;
        font-size: 12px;
        font-weight: 600;
      }
      .totals {
        padding: 18px;
        border-top: 1px solid #e4e7ec;
        display: flex;
        justify-content: flex-end;
      }
      .totals-box {
        width: 240px;
      }
      .totals-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 8px;
        color: #475467;
        font-size: 14px;
      }
      .totals-row--total {
        margin-top: 12px;
        padding-top: 6px;
        color: #111827;
        font-weight: 800;
        font-size: 16px;
      }
      .totals-row--total small {
        font-size: 11px;
        font-weight: 600;
        color: #98a2b3;
        margin-left: 4px;
      }
      .footer-note {
        margin-top: 14px;
        text-align: center;
        color: #98a2b3;
        font-size: 11px;
        line-height: 1.5;
      }
      .footer-note span {
        display: block;
        margin-top: 3px;
      }
      @media print {
        html, body { background: #fff; }
        .page { padding: 0; max-width: none; background: #fff; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="topbar">
        <div class="brand">
          <span class="brand-mark" aria-hidden="true"></span>
          <span>certicode</span>
        </div>
        <div class="top-icons" aria-hidden="true">
          <span class="icon">🛒</span>
          <span class="icon">👤</span>
        </div>
      </div>

      <div class="header">
        <h1>Invoice Details <span class="status-badge">${escapeHtml(normalizedStatus)}</span></h1>
        <p>Manage your billing records and download asset certificates.</p>
      </div>

      <div class="card">
        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">Invoice Number</span>
            <div class="value">${escapeHtml(invoiceNumber)}</div>
          </div>
          <div class="meta-item">
            <span class="label">Order Number</span>
            <div class="value">${escapeHtml(orderNumber)}</div>
          </div>
          <div class="meta-item">
            <span class="label">Date Issued</span>
            <div class="value">${escapeHtml(issuedDate)}</div>
          </div>
        </div>

        <div class="party-grid">
          <div class="party">
            <span class="label">Billed To</span>
            <strong>${escapeHtml(billedToName)}</strong>
            <p>${renderMultiline(billedToLine, "Billing address not provided.")}</p>
          </div>
          <div class="party">
            <span class="label">Issued By</span>
            <strong>Certicode Marketplace Ltd.</strong>
            <p>
              <span>UNIT415 4/F VGP Center, 6772 Ayala Ave., San Lorenzo, Makati City,</span>
              <span>Makati, Philippines, 1223</span>
            </p>
          </div>
        </div>

        <div class="line-items">
          <div class="line-head">
            <span>Asset Name</span>
            <span>License</span>
            <span>Qty</span>
            <span>Price</span>
          </div>
          <div class="line-row">
            <div class="asset">
              <strong>${escapeHtml(productName)}</strong>
              <small>Product ID: ${escapeHtml(productId)}</small>
            </div>
            <div><span class="pill">${escapeHtml(licenseLabel)}</span></div>
            <div>1</div>
            <div>${escapeHtml(total)}</div>
          </div>
        </div>

        <div class="totals">
          <div class="totals-box">
            <div class="totals-row"><span>Subtotal</span><span>${escapeHtml(subtotal)}</span></div>
            <div class="totals-row"><span>VAT / Tax</span><span>${escapeHtml(tax)}</span></div>
            <div class="totals-row"><span>Discount</span><span>-${escapeHtml(discount)}</span></div>
            <div class="totals-row totals-row--total">
              <span>Total Paid</span>
              <span>${escapeHtml(total)}<small>USD</small></span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-note">
        This invoice is a valid tax document generated electronically by Certicode Marketplace.
        <span>© 2026 Certicode Marketplace Ltd. All rights reserved.</span>
      </div>
    </div>

    <script>
      window.onload = function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 150);
      };
      window.onafterprint = function () {
        window.close();
      };
    </script>
  </body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return filename;
};
