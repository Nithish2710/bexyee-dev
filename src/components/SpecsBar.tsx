export function SpecsBar() {
  const specs = [["FABRIC", "240 GSM / 100% COTTON"], ["CONSTRUCTION", "OVERSIZED / DROP SHOULDER"], ["EDITION", "001 — 099 / NUMBERED"], ["ORIGIN", "MADE IN INDIA"], ["PRICE", "₹1,799 / INCL. GST"]];
  return <section className="specs">{specs.map(([label, value]) => <div className="spec" key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>;
}