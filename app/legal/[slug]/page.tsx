import Link from "next/link";

const documents: Record<string, { title: string; body: string[] }> = {
  privacy: { title: "Privacy Policy", body: ["BEXYEE collects only the information needed to process orders, provide support, measure campaign performance, and meet legal obligations.", "Payment details are handled by Razorpay. BEXYEE does not store card or banking credentials. Analytics and advertising data are configured through environment variables and can be disabled by deployment configuration.", "Contact BEXYEE through the business email listed on this website for access, correction, or deletion requests."] },
  terms: { title: "Terms of Service", body: ["By placing an order, you confirm that your details are accurate and that you are authorized to use the selected payment method.", "Product availability, pricing, delivery estimates, and campaign terms are shown at checkout. Orders are subject to stock confirmation and successful payment verification.", "BEXYEE may cancel orders affected by pricing, inventory, payment, or operational errors and will process eligible refunds through the original payment method."] },
  shipping: { title: "Shipping Policy", body: ["Orders are dispatched after payment verification and order processing. Serviceability and delivery fees are confirmed before payment.", "Tracking details are shared when a shipment is created. Delivery timelines vary by destination and carrier conditions.", "For a shipment issue, contact BEXYEE with your order ID and tracking number."] },
  refunds: { title: "Refund & Cancellation Policy", body: ["Cancellation requests are reviewed before dispatch. Approved refunds are returned through Razorpay to the original payment method.", "Items must be unused and in original condition for eligible returns. Final eligibility depends on the product and the reason for the request.", "Contact BEXYEE with your order ID before returning any product. Do not ship an item without written confirmation."] },
  contact: { title: "Contact & Business Information", body: ["BEXYEE / Bengaluru, India", "For order, shipping, returns, or privacy support, contact the business email configured for this deployment.", "Replace this document with your registered business name, address, support email, and response hours before launch."] },
};

export function generateStaticParams() { return Object.keys(documents).map((slug) => ({ slug })); }
export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const document = documents[(await params).slug] ?? documents.terms;
  return <main className="legal-page"><Link href="/" className="commerce-logo">BEXYEE<span>/</span>BLR</Link><p className="commerce-kicker">POLICY / BEXYEE</p><h1>{document.title}</h1>{document.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<Link href="/">RETURN TO CAMPAIGN ↗</Link></main>;
}
