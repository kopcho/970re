import { fetchMLSListings, NOCO_CITIES, formatPrice } from "@/lib/mls";
import Link from "next/link";

export const revalidate = 300;

export default async function AdminListingsPage() {
  const all = await fetchMLSListings({ status: "Active", withMedia: false, top: 200 });
  const listings = all
    .filter((l) => NOCO_CITIES.includes(l.City))
    .sort((a, b) => b.ListPrice - a.ListPrice);

  // City breakdown
  const byCityMap: Record<string, number> = {};
  listings.forEach((l) => { byCityMap[l.City] = (byCityMap[l.City] ?? 0) + 1; });
  const byCity = Object.entries(byCityMap).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "baseline", gap: "1rem" }}>
        <h2 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--green-deep)",
        }}>MLS Feed</h2>
        <span style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.7rem",
          color: "#888",
          letterSpacing: "0.08em",
        }}>
          {listings.length} active NoCo listings
        </span>
      </div>

      {/* City stats */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5rem",
        marginBottom: "2rem",
      }}>
        {byCity.map(([city, count]) => (
          <div key={city} style={{
            background: "#fff",
            border: "1px solid rgba(51,153,51,0.15)",
            borderRadius: "999px",
            padding: "0.35rem 0.85rem",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            color: "var(--green-deep)",
          }}>
            {city} <span style={{ color: "#aaa" }}>·</span> <span style={{ color: "var(--green)" }}>{count}</span>
          </div>
        ))}
      </div>

      {/* Listings table */}
      <div style={{
        background: "#fff",
        border: "1px solid rgba(51,153,51,0.12)",
        borderRadius: "3px",
        overflow: "hidden",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 100px 60px 60px 120px 80px",
          gap: "1rem",
          padding: "0.6rem 1.25rem",
          background: "rgba(51,153,51,0.04)",
          borderBottom: "1px solid rgba(51,153,51,0.1)",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.6rem",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#aaa",
        }}>
          <span>Address</span>
          <span>Price</span>
          <span>Bed</span>
          <span>Bath</span>
          <span>City</span>
          <span>Type</span>
        </div>

        {listings.map((l, i) => (
          <Link
            key={l.ListingKey}
            href={`/listing/${l.ListingKey}`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 100px 60px 60px 120px 80px",
              gap: "1rem",
              padding: "0.75rem 1.25rem",
              textDecoration: "none",
              borderBottom: i < listings.length - 1 ? "1px solid rgba(51,153,51,0.06)" : "none",
              alignItems: "center",
              transition: "background 0.1s",
            }}
          >
            <span style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.82rem",
              color: "var(--neutral)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {l.UnparsedAddress}
            </span>
            <span style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "0.78rem",
              color: "var(--green-deep)",
              fontWeight: 500,
            }}>
              {formatPrice(l.ListPrice)}
            </span>
            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.78rem", color: "#666" }}>
              {l.BedroomsTotal ?? "—"}
            </span>
            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.78rem", color: "#666" }}>
              {l.BathroomsTotalInteger ?? "—"}
            </span>
            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.72rem", color: "#888" }}>
              {l.City}
            </span>
            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.65rem", color: "#aaa" }}>
              {l.PropertyType ?? "—"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
