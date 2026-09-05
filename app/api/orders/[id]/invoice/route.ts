import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../../src/lib/supabase-server";
import { calculateOrderInvoice, generateInvoiceHtml, type InvoiceData } from "../../../../../src/lib/invoicing";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const url = new URL(request.url);
  const format = url.searchParams.get("format") || "html";

  if (!id) {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  }

  // 1. If Supabase is available, look up order and invoice
  if (supabaseServer) {
    // Check if invoice already generated
    const { data: existingInvoice } = await supabaseServer
      .from("invoices")
      .select("*")
      .eq("order_id", id)
      .maybeSingle();

    if (existingInvoice) {
      const invoiceData: InvoiceData = {
        orderId: existingInvoice.order_id,
        invoiceNumber: existingInvoice.invoice_number,
        date: existingInvoice.created_at,
        seller: {
          name: existingInvoice.seller_name,
          address: existingInvoice.seller_address,
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560001",
          gstin: existingInvoice.gstin,
          stateCode: "29",
        },
        customer: {
          name: existingInvoice.customer_name,
          email: existingInvoice.customer_email || "",
          phone: existingInvoice.customer_phone || "",
          addressLine1: existingInvoice.customer_address?.line1 || "",
          city: existingInvoice.customer_address?.city || "Bengaluru",
          state: existingInvoice.customer_state,
          pincode: existingInvoice.customer_address?.pincode || "560001",
        },
        placeOfSupply: existingInvoice.customer_state,
        isInterstate: existingInvoice.is_interstate,
        hsnCode: existingInvoice.hsn_code,
        lineItems: existingInvoice.line_items,
        totals: {
          taxableAmountPaise: existingInvoice.taxable_amount_paise,
          cgstPaise: existingInvoice.cgst_paise,
          sgstPaise: existingInvoice.sgst_paise,
          igstPaise: existingInvoice.igst_paise,
          shippingPaise: existingInvoice.shipping_paise,
          totalPaise: existingInvoice.total_amount_paise,
        },
      };

      if (format === "json") {
        return NextResponse.json(invoiceData);
      }

      return new Response(generateInvoiceHtml(invoiceData), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    // If invoice not saved yet, fetch order to generate on the fly
    const { data: order } = await supabaseServer
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .maybeSingle();

    if (order) {
      const address = (order.address || {}) as { name?: string; phone?: string; line1?: string; city?: string; state?: string; pincode?: string };
      type RawItem = { product_name: string; sku: string; size: string; quantity: number; unit_price_paise: number };
      const items = ((order.order_items || []) as RawItem[]).map((it) => ({
        productName: it.product_name,
        sku: it.sku,
        size: it.size,
        quantity: it.quantity,
        unitPricePaise: it.unit_price_paise,
      }));

      const generatedInvoice = calculateOrderInvoice({
        orderId: order.id,
        invoiceNumber: `INV-${new Date().getFullYear()}-${order.id.slice(0, 4).toUpperCase()}`,
        createdAt: order.created_at,
        customerName: address.name || "Customer",
        customerEmail: order.guest_email || "",
        customerPhone: address.phone || "",
        address,
        items,
        shippingPaise: order.shipping_paise,
      });

      if (format === "json") {
        return NextResponse.json(generatedInvoice);
      }

      return new Response(generateInvoiceHtml(generatedInvoice), {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }
  }

  // Demonstration Fallback Invoice
  const fallbackInvoice = calculateOrderInvoice({
    orderId: id,
    invoiceNumber: `INV-${new Date().getFullYear()}-0001`,
    createdAt: new Date().toISOString(),
    customerName: "Bengaluru Collector",
    customerEmail: "collector@bexyee.com",
    customerPhone: "+91 98765 43210",
    address: {
      line1: "12/4 Lavelle Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
    },
    items: [
      {
        productName: "Bengaluru Edition Heavyweight Tee",
        sku: "BEXYEE-BLR-001",
        size: "M",
        quantity: 1,
        unitPricePaise: 179900,
        gstRate: 12,
      },
    ],
    shippingPaise: 0,
  });

  if (format === "json") {
    return NextResponse.json(fallbackInvoice);
  }

  return new Response(generateInvoiceHtml(fallbackInvoice), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
