import { splitGst } from "./commerce";

export type InvoiceLineItem = {
  productName: string;
  sku: string;
  size: string;
  quantity: number;
  hsnCode: string;
  unitPricePaise: number;
  taxableValuePaise: number;
  gstRate: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalPaise: number;
};

export type InvoiceData = {
  id?: string;
  orderId: string;
  invoiceNumber: string;
  date: string;
  seller: {
    name: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstin: string;
    stateCode: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
    stateCode?: string;
  };
  placeOfSupply: string;
  isInterstate: boolean;
  hsnCode: string;
  lineItems: InvoiceLineItem[];
  totals: {
    taxableAmountPaise: number;
    cgstPaise: number;
    sgstPaise: number;
    igstPaise: number;
    shippingPaise: number;
    totalPaise: number;
  };
};

export const DEFAULT_SELLER_INFO = {
  name: "BEXYEE APPAREL LABS PRIVATE LIMITED",
  address: "12/4 Lavelle Road, Shanthala Nagar, Ashok Nagar",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  gstin: process.env.SELLER_GSTIN || process.env.NEXT_PUBLIC_SELLER_GSTIN || "29AABCB1234F1Z5",
  stateCode: "29",
};

/**
 * Normalizes an Indian state string to standard state code and name
 */
export function normalizeIndianState(stateStr: string): { state: string; isKarnataka: boolean } {
  const clean = (stateStr || "").trim().toLowerCase();
  const isKa = clean === "karnataka" || clean === "ka" || clean === "kar" || clean === "blr" || clean === "bengaluru" || clean === "bangalore" || clean === "29";
  return {
    state: isKa ? "Karnataka" : stateStr || "Other",
    isKarnataka: isKa,
  };
}

/**
 * Calculates complete legal GST breakdown for an order
 */
export function calculateOrderInvoice(params: {
  orderId: string;
  invoiceNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: {
    line1?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items: Array<{
    productName: string;
    sku: string;
    size: string;
    quantity: number;
    unitPricePaise: number;
    gstRate?: number;
    hsnCode?: string;
  }>;
  shippingPaise?: number;
}): InvoiceData {
  const { state, isKarnataka } = normalizeIndianState(params.address.state || "");
  const isInterstate = !isKarnataka;
  const defaultHsn = "6109"; // Knitted / Crocheted T-shirts

  let subtotalTaxablePaise = 0;
  let totalCgstPaise = 0;
  let totalSgstPaise = 0;
  let totalIgstPaise = 0;
  let subtotalTotalPaise = 0;

  const lineItems: InvoiceLineItem[] = params.items.map((item) => {
    const rate = item.gstRate ?? 12;
    const inclusiveTotalItemPaise = item.unitPricePaise * item.quantity;
    const { basePaise: taxablePaise } = splitGst(inclusiveTotalItemPaise, rate);
    const gstPaise = inclusiveTotalItemPaise - taxablePaise;

    let cgstPaise = 0;
    let sgstPaise = 0;
    let igstPaise = 0;

    if (isInterstate) {
      igstPaise = gstPaise;
    } else {
      cgstPaise = Math.round(gstPaise / 2);
      sgstPaise = gstPaise - cgstPaise;
    }

    subtotalTaxablePaise += taxablePaise;
    totalCgstPaise += cgstPaise;
    totalSgstPaise += sgstPaise;
    totalIgstPaise += igstPaise;
    subtotalTotalPaise += inclusiveTotalItemPaise;

    return {
      productName: item.productName,
      sku: item.sku,
      size: item.size,
      quantity: item.quantity,
      hsnCode: item.hsnCode || defaultHsn,
      unitPricePaise: item.unitPricePaise,
      taxableValuePaise: taxablePaise,
      gstRate: rate,
      cgstPaise,
      sgstPaise,
      igstPaise,
      totalPaise: inclusiveTotalItemPaise,
    };
  });

  const shippingPaise = params.shippingPaise || 0;
  const finalTotalPaise = subtotalTotalPaise + shippingPaise;

  return {
    orderId: params.orderId,
    invoiceNumber: params.invoiceNumber,
    date: params.createdAt,
    seller: DEFAULT_SELLER_INFO,
    customer: {
      name: params.customerName || "Customer",
      email: params.customerEmail || "",
      phone: params.customerPhone || "",
      addressLine1: params.address.line1 || "",
      city: params.address.city || "Bengaluru",
      state,
      pincode: params.address.pincode || "560001",
    },
    placeOfSupply: state,
    isInterstate,
    hsnCode: defaultHsn,
    lineItems,
    totals: {
      taxableAmountPaise: subtotalTaxablePaise,
      cgstPaise: totalCgstPaise,
      sgstPaise: totalSgstPaise,
      igstPaise: totalIgstPaise,
      shippingPaise,
      totalPaise: finalTotalPaise,
    },
  };
}

/**
 * Generates an accessible, clean, printable HTML string for the legal invoice
 */
export function generateInvoiceHtml(invoice: InvoiceData): string {
  const money = (p: number) => `₹${(p / 100).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
  const dateFormatted = new Date(invoice.date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice — ${invoice.invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111;
      background: #fff;
      margin: 0;
      padding: 32px;
      font-size: 13px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #ddd;
      padding: 32px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #111;
      padding-bottom: 18px;
      margin-bottom: 20px;
    }
    .brand-title {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin: 0 0 4px 0;
    }
    .badge {
      display: inline-block;
      background: #111;
      color: #fff;
      font-size: 10px;
      padding: 2px 6px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .meta-table {
      width: 100%;
      margin-bottom: 24px;
      border-collapse: collapse;
    }
    .meta-table td {
      width: 50%;
      vertical-align: top;
      padding: 6px 0;
    }
    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #666;
      display: block;
      margin-bottom: 2px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .items-table th, .items-table td {
      border: 1px solid #e0e0e0;
      padding: 8px 10px;
      text-align: left;
    }
    .items-table th {
      background: #f8f8f8;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .items-table td.num, .items-table th.num {
      text-align: right;
    }
    .totals-area {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
    .totals-table {
      width: 320px;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 6px 8px;
    }
    .totals-table tr.total-row td {
      border-top: 2px solid #111;
      font-weight: 800;
      font-size: 15px;
    }
    .footer-note {
      margin-top: 36px;
      padding-top: 16px;
      border-top: 1px dashed #ccc;
      font-size: 11px;
      color: #666;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .invoice-card { border: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="no-print" style="margin-bottom: 20px; text-align: right;">
      <button onclick="window.print()" style="background: #111; color: #fff; border: 0; padding: 8px 16px; font-weight: 700; cursor: pointer; font-size: 12px;">
        PRINT / DOWNLOAD PDF ↗
      </button>
    </div>

    <div class="header">
      <div>
        <div class="brand-title">BEXYEE</div>
        <div class="badge">ORIGINAL TAX INVOICE</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 14px; font-weight: 700;">${invoice.invoiceNumber}</div>
        <div style="font-size: 11px; color: #666;">Date: ${dateFormatted}</div>
        <div style="font-size: 11px; color: #666;">Order ID: ${invoice.orderId}</div>
      </div>
    </div>

    <table class="meta-table">
      <tr>
        <td>
          <span class="meta-label">Sold By / Seller Details:</span>
          <strong>${invoice.seller.name}</strong><br>
          ${invoice.seller.address}<br>
          ${invoice.seller.city}, ${invoice.seller.state} - ${invoice.seller.pincode}<br>
          <strong>GSTIN:</strong> ${invoice.seller.gstin}<br>
          <strong>State Code:</strong> ${invoice.seller.stateCode} (Karnataka)
        </td>
        <td>
          <span class="meta-label">Billed &amp; Shipped To:</span>
          <strong>${invoice.customer.name}</strong><br>
          ${invoice.customer.addressLine1 || "Address on file"}<br>
          ${invoice.customer.city}, ${invoice.customer.state} - ${invoice.customer.pincode}<br>
          <strong>Place of Supply:</strong> ${invoice.placeOfSupply}<br>
          <strong>Phone:</strong> ${invoice.customer.phone || "N/A"}
        </td>
      </tr>
    </table>

    <table class="items-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Description</th>
          <th>HSN</th>
          <th>Size</th>
          <th class="num">Qty</th>
          <th class="num">Unit Price</th>
          <th class="num">Taxable Val</th>
          <th class="num">GST%</th>
          ${invoice.isInterstate ? '<th class="num">IGST</th>' : '<th class="num">CGST</th><th class="num">SGST</th>'}
          <th class="num">Total</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.lineItems.map((item, idx) => `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${item.productName}</strong><br><small style="color: #666;">SKU: ${item.sku}</small></td>
            <td>${item.hsnCode}</td>
            <td>${item.size}</td>
            <td class="num">${item.quantity}</td>
            <td class="num">${money(item.unitPricePaise)}</td>
            <td class="num">${money(item.taxableValuePaise)}</td>
            <td class="num">${item.gstRate}%</td>
            ${invoice.isInterstate
              ? `<td class="num">${money(item.igstPaise)}</td>`
              : `<td class="num">${money(item.cgstPaise)}</td><td class="num">${money(item.sgstPaise)}</td>`
            }
            <td class="num"><strong>${money(item.totalPaise)}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>

    <div class="totals-area">
      <table class="totals-table">
        <tr>
          <td>Total Taxable Value:</td>
          <td style="text-align: right;">${money(invoice.totals.taxableAmountPaise)}</td>
        </tr>
        ${invoice.isInterstate ? `
          <tr>
            <td>Integrated GST (IGST):</td>
            <td style="text-align: right;">${money(invoice.totals.igstPaise)}</td>
          </tr>
        ` : `
          <tr>
            <td>Central GST (CGST):</td>
            <td style="text-align: right;">${money(invoice.totals.cgstPaise)}</td>
          </tr>
          <tr>
            <td>State GST (SGST):</td>
            <td style="text-align: right;">${money(invoice.totals.sgstPaise)}</td>
          </tr>
        `}
        <tr>
          <td>Shipping &amp; Handling:</td>
          <td style="text-align: right;">${invoice.totals.shippingPaise === 0 ? "FREE" : money(invoice.totals.shippingPaise)}</td>
        </tr>
        <tr class="total-row">
          <td>Grand Total (INR):</td>
          <td style="text-align: right;">${money(invoice.totals.totalPaise)}</td>
        </tr>
      </table>
    </div>

    <div class="footer-note">
      This is a computer-generated tax invoice and requires no physical signature under Indian GST Laws.<br>
      For queries, contact <strong>support@bexyee.com</strong>.
    </div>
  </div>
</body>
</html>`;
}
