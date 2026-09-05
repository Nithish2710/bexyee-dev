import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { cartItemSchema } from "../../../src/lib/commerce";
import { supabaseServer } from "../../../src/lib/supabase-server";

const guestCookie = "bexyee_guest_token";

async function getGuestToken() {
  const cookieStore = await cookies();
  let token = cookieStore.get(guestCookie)?.value;
  if (!token) {
    token = crypto.randomUUID();
    cookieStore.set(guestCookie, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 30, path: "/" });
  }
  return token;
}

async function getCart() {
  if (!supabaseServer) return null;
  const guestToken = await getGuestToken();
  const { data: cart, error: cartError } = await supabaseServer.from("carts").upsert({ guest_token: guestToken }, { onConflict: "guest_token" }).select("id").single();
  if (cartError || !cart) throw new Error("Unable to load cart.");
  const { data: items, error: itemsError } = await supabaseServer.from("cart_items").select("id, product_id, size, quantity, products(name, sku, price_paise, front_image_url)").eq("cart_id", cart.id);
  if (itemsError) throw new Error("Unable to load cart items.");
  return { id: cart.id, items: items ?? [] };
}

export async function GET() {
  try {
    return NextResponse.json({ cart: await getCart() });
  } catch {
    return NextResponse.json({ error: "Unable to load cart." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!supabaseServer) return NextResponse.json({ error: "Cart storage is not configured." }, { status: 503 });
  const parsed = cartItemSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
  try {
    const guestToken = await getGuestToken();
    const { data: cart } = await supabaseServer.from("carts").upsert({ guest_token: guestToken }, { onConflict: "guest_token" }).select("id").single();
    let { data: product } = await supabaseServer.from("products").select("id, status, product_sizes(size, stock_quantity)").eq("id", parsed.data.productId).eq("status", "ACTIVE").maybeSingle();
    
    if (!product) {
      const res = await supabaseServer.from("products").select("id, status, product_sizes(size, stock_quantity)").or("slug.eq.bengaluru-tee,slug.eq.bengaluru,sku.eq.BEXYEE-BLR-001").eq("status", "ACTIVE").limit(1).maybeSingle();
      product = res.data;
    }

    const available = product?.product_sizes?.find((entry: { size: string; stock_quantity: number }) => entry.size === parsed.data.size)?.stock_quantity ?? 0;
    if (!cart || !product || available < parsed.data.quantity) return NextResponse.json({ error: "Selected size is unavailable." }, { status: 409 });
    const { error } = await supabaseServer.from("cart_items").upsert({ cart_id: cart.id, product_id: product.id, size: parsed.data.size, quantity: parsed.data.quantity }, { onConflict: "cart_id,product_id,size" });
    if (error) throw error;
    return NextResponse.json(await getCart());
  } catch {
    return NextResponse.json({ error: "Unable to update cart." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!supabaseServer) return NextResponse.json({ error: "Cart storage is not configured." }, { status: 503 });
  const parsed = cartItemSchema.extend({ itemId: cartItemSchema.shape.productId }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart update." }, { status: 400 });
  const { error } = await supabaseServer.from("cart_items").update({ quantity: parsed.data.quantity }).eq("id", parsed.data.itemId);
  if (error) return NextResponse.json({ error: "Unable to update cart." }, { status: 500 });
  return NextResponse.json(await getCart());
}

export async function DELETE(request: Request) {
  if (!supabaseServer) return NextResponse.json({ error: "Cart storage is not configured." }, { status: 503 });
  const itemId = new URL(request.url).searchParams.get("itemId");
  if (!itemId) return NextResponse.json({ error: "Item is required." }, { status: 400 });
  const { error } = await supabaseServer.from("cart_items").delete().eq("id", itemId);
  if (error) return NextResponse.json({ error: "Unable to remove cart item." }, { status: 500 });
  return NextResponse.json(await getCart());
}
