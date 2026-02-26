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
  cleanText(value || "customer_profile")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_");

const multilineHtml = (value, fallback = "Not provided") => {
  const source = cleanText(value || fallback);
  return source
    .split(/\n+/)
    .filter(Boolean)
    .map((line) => `<span>${escapeHtml(line)}</span>`)
    .join("");
};

export const downloadCustomerProfilePdf = ({
  customer = {},
  transactions = [],
} = {}) => {
  const fileName = `${toFilename(`customer_profile_${customer.name || "customer"}`)}.pdf`;
  const printWindow = window.open("", "_blank", "width=1080,height=1080");

  if (!printWindow) {
    throw new Error("Popup blocked. Please allow popups to export PDF.");
  }

  const rowsHtml =
    transactions.length > 0
      ? transactions
          .map(
            (row) => `
          <tr>
            <td>${escapeHtml(row.orderNumber || "-")}</td>
            <td>
              <div class="asset-cell">
                <strong>${escapeHtml(row.assetName || "Digital Asset")}</strong>
                <span class="tag">${escapeHtml(String(row.category || "Asset").toUpperCase())}</span>
              </div>
            </td>
            <td>
              <div class="date-cell">
                <strong>${escapeHtml(row.dateLabel || "-")}</strong>
                <span>${escapeHtml(row.timeLabel || "-")}</span>
              </div>
            </td>
            <td class="amount">${escapeHtml(row.amount || "$0.00")}</td>
            <td><span class="status">${escapeHtml(row.statusLabel || "PENDING")}</span></td>
          </tr>`,
          )
          .join("")
      : `<tr><td colspan="5" class="empty">No transactions found.</td></tr>`;

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(fileName)}</title>
    <style>
      @page { size: A4 landscape; margin: 10mm; }
      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; background: #f3f5f9; color: #0f172a; font-family: "Segoe UI", Arial, sans-serif; }
      .page { max-width: 1120px; margin: 0 auto; padding: 14px; }
      .topbar {
        display: flex; justify-content: space-between; align-items: center;
        background: #fff; border: 1px solid #e4e7ec; border-radius: 14px;
        padding: 14px 16px; margin-bottom: 14px;
      }
      .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 22px; }
      .brand small { display: block; font-size: 11px; font-weight: 700; color: #f97316; letter-spacing: .12em; text-transform: uppercase; }
      .brand-wrap { display: flex; flex-direction: column; line-height: 1; }
      .mark {
        width: 32px; height: 32px; border-radius: 8px;
        background:
          radial-gradient(circle at 18% 18%, #ff7a1a 0 11%, transparent 12%),
          radial-gradient(circle at 82% 18%, #111827 0 11%, transparent 12%),
          radial-gradient(circle at 18% 82%, #111827 0 11%, transparent 12%),
          radial-gradient(circle at 82% 82%, #ff7a1a 0 11%, transparent 12%),
          linear-gradient(90deg, #111827 0 37%, transparent 37% 63%, #111827 63% 100%);
      }
      .export-meta { color: #64748b; font-size: 12px; text-align: right; }
      .grid { display: grid; grid-template-columns: 320px 1fr; gap: 14px; }
      .card {
        background: #fff; border: 1px solid #e4e7ec; border-radius: 14px;
        overflow: hidden;
      }
      .profile-panel { padding: 18px; }
      .avatar {
        width: 88px; height: 88px; border-radius: 50%;
        margin: 0 auto 16px;
        border: 2px solid #e4e7ec;
        background: #eef2f7; color: #0f172a;
        display: flex; align-items: center; justify-content: center;
        font-weight: 700; font-size: 28px;
      }
      .center { text-align: center; }
      .center h2 { margin: 0; font-size: 18px; }
      .center p { margin: 6px 0 0; color: #667085; font-size: 13px; }
      .pill {
        display: inline-flex; align-items: center; justify-content: center;
        margin-top: 12px; padding: 6px 12px; border-radius: 999px;
        font-size: 12px; font-weight: 700;
        color: ${String(customer.statusLabel || "").includes("ACTIVE") ? "#16a34a" : "#b45309"};
        background: ${String(customer.statusLabel || "").includes("ACTIVE") ? "#dcfce7" : "#fef3c7"};
      }
      .divider { height: 1px; background: #eef2f7; margin: 16px 0; }
      .section h4 { margin: 0 0 8px; font-size: 14px; }
      .row { display: flex; justify-content: space-between; gap: 12px; margin: 7px 0; }
      .row span:first-child { color: #667085; font-size: 13px; }
      .row span:last-child { font-weight: 600; font-size: 13px; text-align: right; }
      .addr { color: #0f172a; font-size: 13px; line-height: 1.5; }
      .addr span { display: block; }
      .content { display: flex; flex-direction: column; gap: 14px; }
      .stats { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 14px; }
      .stat { padding: 18px; }
      .stat small { color: #98a2b3; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; display: block; margin-bottom: 10px; }
      .stat strong { font-size: 17px; }
      .table-card { padding: 16px; }
      .table-title { margin: 0 0 12px; color: #f97316; font-size: 14px; font-weight: 700; }
      table { width: 100%; border-collapse: collapse; }
      th {
        text-align: left; font-size: 11px; color: #98a2b3; text-transform: uppercase;
        letter-spacing: .12em; background: #f8fafc; padding: 12px; border-bottom: 1px solid #eef2f7;
      }
      td { padding: 12px; border-bottom: 1px solid #eef2f7; font-size: 13px; vertical-align: top; }
      .asset-cell strong { display: block; color: #111827; margin-bottom: 4px; }
      .tag {
        display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 6px;
        background: #eef2ff; color: #4f46e5; font-size: 11px; font-weight: 700;
      }
      .date-cell strong { display: block; margin-bottom: 3px; }
      .date-cell span { color: #98a2b3; font-size: 12px; }
      .amount { font-weight: 700; color: #111827; }
      .status {
        display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 999px;
        background: #dcfce7; color: #16a34a; font-weight: 700; font-size: 11px;
      }
      .empty { color: #667085; text-align: center; padding: 18px; }
      .footer { margin-top: 12px; text-align: center; color: #98a2b3; font-size: 11px; }
      @media print {
        html, body { background: #fff; }
        .page { padding: 0; max-width: none; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="topbar">
        <div class="brand">
          <span class="mark" aria-hidden="true"></span>
          <span class="brand-wrap">
            <span>certicode</span>
            <small>Admin Panel</small>
          </span>
        </div>
        <div class="export-meta">
          <div>Customer Profile Export</div>
          <div>${escapeHtml(new Date().toLocaleString())}</div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <div class="profile-panel">
            <div class="avatar">${escapeHtml((customer.name || "C").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase())}</div>
            <div class="center">
              <h2>${escapeHtml(customer.name || "Customer")}</h2>
              <p>${escapeHtml(customer.email || "No email provided")}</p>
              <p>Joined: ${escapeHtml(customer.joinedAt || "Not available")}</p>
              <span class="pill">• ${escapeHtml(customer.statusLabel || "ACTIVE")}</span>
            </div>

            <div class="divider"></div>
            <div class="section">
              <h4>Contact Information</h4>
              <div class="row"><span>Phone</span><span>${escapeHtml(customer.phone || "Not provided")}</span></div>
            </div>

            <div class="divider"></div>
            <div class="section">
              <h4>Business Information</h4>
              <div class="row"><span>Company</span><span>${escapeHtml(customer.company || "Not provided")}</span></div>
            </div>

            <div class="divider"></div>
            <div class="section">
              <h4>Delivery Address</h4>
              <div class="addr">${multilineHtml(customer.address, "Not provided")}</div>
            </div>
          </div>
        </div>

        <div class="content">
          <div class="stats">
            <div class="card stat">
              <small>Total Spent</small>
              <strong>${escapeHtml(customer.totalSpent || "$0.00")}</strong>
            </div>
            <div class="card stat">
              <small>Total Orders</small>
              <strong>${escapeHtml(String(customer.totalOrders ?? 0))} orders</strong>
            </div>
            <div class="card stat">
              <small>Last Order Date</small>
              <strong>${escapeHtml(customer.lastOrderDate || "No orders yet")}</strong>
            </div>
          </div>

          <div class="card table-card">
            <h3 class="table-title">Transaction History</h3>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Asset Name</th>
                  <th>Date / Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="footer">Generated by Certicode Admin Panel</div>
    </div>
    <script>
      window.onload = function () {
        setTimeout(function () {
          window.focus();
          window.print();
        }, 150);
      };
      window.onafterprint = function () { window.close(); };
    </script>
  </body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  return fileName;
};

