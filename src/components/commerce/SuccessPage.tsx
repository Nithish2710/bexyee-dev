import Link from "next/link";

export function SuccessPage({ orderId }: { orderId: string }) {
  return <main className="commerce-page success-page"><div className="success-mark">BEXYEE<span>/</span>BLR</div><p className="commerce-kicker">PAYMENT VERIFIED / ORDER CONFIRMED</p><h1>It&apos;s yours.</h1><p>Your BEXYEE Bengaluru edition is now in the system.</p><div className="success-order">ORDER / {orderId || "PENDING"}</div><div className="success-actions"><Link href={`/track?order=${orderId}`}>TRACK ORDER ↗</Link><Link href="/">RETURN TO CAMPAIGN</Link></div></main>;
}
