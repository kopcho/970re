"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MLSListingDetail, formatPrice, formatSqft } from "@/lib/mls";
import Footer from "@/components/Footer";

function Gallery({ media }: { media: Array<{ MediaURL: string; Order?: number; LongDescription?: string }> }) {
  const sorted = [...media].sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999));
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  return (
    <div>
      {/* Main photo */}
      <div style={{
        width: "100%",
        aspectRatio: "16/9",
        background: "#d4e4d4",
        position: "relative",
        overflow: "hidden",
        borderRadius: "3px",
      }}>
        {!loaded[active] && <div className="gallery-shimmer" />}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={sorted[active]?.MediaURL}
          src={sorted[active]?.MediaURL}
          alt={sorted[active]?.LongDescription ?? "Property photo"}
          onLoad={() => setLoaded((p) => ({ ...p, [active]: true }))}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: loaded[active] ? 1 : 0,
            transition: "opacity 0.3s ease",
            position: "absolute", inset: 0,
          }}
        />
        {/* nav arrows */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={() => { setActive((a) => (a - 1 + sorted.length) % sorted.length); }}
              className="gallery-arrow gallery-arrow-left"
              aria-label="Previous photo"
            >‹</button>
            <button
              onClick={() => { setActive((a) => (a + 1) % sorted.length); }}
              className="gallery-arrow gallery-arrow-right"
              aria-label="Next photo"
            >›</button>
            <div className="gallery-counter">{active + 1} / {sorted.length}</div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {sorted.length > 1 && (
        <div style={{
          display: "flex",
          gap: "0.4rem",
          marginTop: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.25rem",
        }}>
          {sorted.slice(0, 12).map((m, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0,
                width: 72, height: 52,
                border: i === active ? "2px solid var(--green)" : "2px solid transparent",
                borderRadius: "2px",
                overflow: "hidden",
                padding: 0,
                cursor: "pointer",
                background: "#d4e4d4",
                opacity: i === active ? 1 : 0.65,
                transition: "opacity 0.15s, border-color 0.15s",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.MediaURL}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </button>
          ))}
        </div>
      )}

      <style>{`
        .gallery-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, #d4e4d4 25%, #e8f0e8 50%, #d4e4d4 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .gallery-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(0,0,0,0.45); color: #fff; border: none;
          width: 40px; height: 40px; border-radius: 50%;
          font-size: 1.4rem; cursor: pointer; line-height: 1;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .gallery-arrow:hover { background: rgba(0,0,0,0.7); }
        .gallery-arrow-left { left: 0.75rem; }
        .gallery-arrow-right { right: 0.75rem; }
        .gallery-counter {
          position: absolute; bottom: 0.75rem; right: 0.75rem;
          background: rgba(0,0,0,0.5); color: #fff;
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.7rem; padding: 0.2rem 0.5rem;
          border-radius: 1px; letter-spacing: 0.06em;
        }
      `}</style>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (value == null || value === "" || value === false) return null;
  return (
    <div style={{ display: "flex", gap: "1rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(51,153,51,0.08)" }}>
      <span style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#aaa", minWidth: 140, flexShrink: 0,
      }}>{label}</span>
      <span style={{ fontSize: "0.9rem", color: "var(--neutral)" }}>{String(value)}</span>
    </div>
  );
}

export default function ListingDetailPage({ params }: { params: { key: string } }) {
  const [listing, setListing] = useState<MLSListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch(`/api/listing/${params.key}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setNotFound(true);
        else setListing(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.key]);

  const sqft = listing?.LivingArea ?? listing?.AboveGradeFinishedArea;
  const media = listing?.Media ?? [];
  const sorted = [...media].sort((a, b) => (a.Order ?? 999) - (b.Order ?? 999));

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", padding: "8rem 5rem", textAlign: "center" }}>
        <div className="listing-spinner" />
        <p style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.8rem", color: "#aaa", marginTop: "1rem" }}>
          Loading listing…
        </p>
        <style>{`.listing-spinner { display:inline-block; width:32px; height:32px; border:3px solid rgba(51,153,51,0.2); border-top-color:var(--green); border-radius:50%; animation:spin 0.8s linear infinite; } @keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </main>
    );
  }

  if (notFound || !listing) {
    return (
      <main style={{ minHeight: "100vh", padding: "8rem 5rem", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.5rem", color: "var(--green-deep)", marginBottom: "1rem" }}>
          Listing not found
        </p>
        <Link href="/search" style={{ color: "var(--green)", fontSize: "0.9rem" }}>← Back to search</Link>
      </main>
    );
  }

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--white)" }}>
        {/* Breadcrumb */}
        <div style={{ padding: "1.5rem 5rem 0", borderBottom: "1px solid rgba(51,153,51,0.08)" }}>
          <Link href="/search" style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
            color: "var(--green)", textDecoration: "none",
          }}>
            ← Search
          </Link>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 5rem 5rem" }}>
          <div className="listing-layout">
            {/* Left: photos + details */}
            <div>
              {sorted.length > 0 && <Gallery media={sorted} />}

              {/* Details table */}
              <div style={{ marginTop: "2rem" }}>
                <h2 style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                  color: "#aaa", marginBottom: "0.5rem",
                }}>Property Details</h2>
                <DetailRow label="Bedrooms" value={listing.BedroomsTotal} />
                <DetailRow label="Bathrooms" value={listing.BathroomsTotalInteger} />
                <DetailRow label="Living Area" value={sqft ? `${formatSqft(sqft)} sqft` : null} />
                <DetailRow label="Lot Size" value={listing.LotSizeAcres ? `${listing.LotSizeAcres} acres` : null} />
                <DetailRow label="Garage Spaces" value={listing.GarageSpaces} />
                <DetailRow label="Year Built" value={listing.YearBuilt} />
                <DetailRow label="Property Type" value={listing.PropertyType} />
                <DetailRow label="Status" value={listing.StandardStatus} />
                <DetailRow label="Days on Market" value={listing.DaysOnMarket} />
                <DetailRow label="Zoning" value={listing.Zoning} />
                <DetailRow label="Subdivision" value={listing.SubdivisionName} />
                <DetailRow label="County" value={listing.CountyOrParish} />
                <DetailRow label="School District" value={listing.HighSchool ? `${listing.ElementarySchool ?? ""} / ${listing.HighSchool}` : null} />
                <DetailRow label="Heating" value={listing.Heating?.join(", ")} />
                <DetailRow label="Cooling" value={listing.Cooling?.join(", ")} />
                <DetailRow label="Basement" value={listing.Basement?.join(", ")} />
                <DetailRow label="Roof" value={listing.Roof?.join(", ")} />
                <DetailRow label="Construction" value={listing.ConstructionMaterials?.join(", ")} />
              </div>

              {/* Remarks */}
              {listing.PublicRemarks && (
                <div style={{ marginTop: "2rem" }}>
                  <h2 style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    color: "#aaa", marginBottom: "0.75rem",
                  }}>Description</h2>
                  <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: 1.7 }}>
                    {listing.PublicRemarks}
                  </p>
                </div>
              )}

              {/* Attribution */}
              <p style={{
                marginTop: "2rem",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "0.65rem", color: "#bbb", letterSpacing: "0.06em",
              }}>
                MLS #{listing.ListingKey} · Data provided by IRES MLS via MLS Grid
              </p>
            </div>

            {/* Right: price + CTA */}
            <div>
              <div style={{
                position: "sticky", top: "5rem",
                background: "#fff",
                border: "1px solid rgba(51,153,51,0.12)",
                borderRadius: "3px",
                padding: "1.75rem",
              }}>
                <div style={{
                  fontFamily: "var(--font-fraunces), serif",
                  fontSize: "2rem", fontWeight: 700,
                  color: "var(--green-deep)", marginBottom: "0.25rem",
                }}>
                  {formatPrice(listing.ListPrice)}
                </div>
                <div style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.7rem", letterSpacing: "0.08em",
                  color: "#aaa", marginBottom: "1.25rem",
                }}>
                  {listing.UnparsedAddress} · {listing.City}, CO {listing.PostalCode}
                </div>

                <div style={{
                  display: "flex", gap: "1rem", flexWrap: "wrap",
                  marginBottom: "1.5rem",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.8rem", color: "#666",
                }}>
                  {listing.BedroomsTotal != null && <span>{listing.BedroomsTotal} bd</span>}
                  {listing.BathroomsTotalInteger != null && <span>{listing.BathroomsTotalInteger} ba</span>}
                  {sqft && <span>{formatSqft(sqft)} sqft</span>}
                  {listing.LotSizeAcres && <span>{listing.LotSizeAcres} ac</span>}
                </div>

                <Link
                  href={`/contact?re=${encodeURIComponent(listing.UnparsedAddress + ', ' + listing.City)}`}
                  style={{
                    display: "block", width: "100%", textAlign: "center",
                    background: "var(--orange)", color: "#fff",
                    padding: "0.9rem 1rem", borderRadius: "2px",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.95rem", fontWeight: 500,
                    textDecoration: "none", marginBottom: "0.75rem",
                  }}
                >
                  Ask Rich About This Home
                </Link>

                <a
                  href="tel:+19706698677"
                  style={{
                    display: "block", width: "100%", textAlign: "center",
                    border: "1px solid rgba(51,153,51,0.25)", color: "var(--green)",
                    padding: "0.75rem 1rem", borderRadius: "2px",
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.875rem", textDecoration: "none",
                  }}
                >
                  Call (970) 669-8677
                </a>

                {listing.ListAgentFullName && (
                  <p style={{
                    marginTop: "1.25rem",
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.65rem", color: "#bbb", letterSpacing: "0.06em",
                    lineHeight: 1.6,
                  }}>
                    Listed by {listing.ListAgentFullName}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>

      <style>{`
        .listing-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .listing-layout {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 700px) {
          main { padding-left: 0 !important; }
        }
      `}</style>
    </>
  );
}
