"use client";

import { useState, useEffect, useCallback } from "react";
import MLSListingCard from "@/components/MLSListingCard";
import { MLSListing, NOCO_CITIES } from "@/lib/mls";
import Footer from "@/components/Footer";

const PRICE_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "$200K", value: 200000 },
  { label: "$300K", value: 300000 },
  { label: "$400K", value: 400000 },
  { label: "$500K", value: 500000 },
  { label: "$600K", value: 600000 },
  { label: "$800K", value: 800000 },
  { label: "$1M+", value: 1000000 },
];

const BEDS_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
];

interface SearchResult {
  listings: MLSListing[];
  total: number;
  pages: number;
}

export default function SearchPage() {
  const [city, setCity] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        city,
        minPrice: String(minPrice),
        maxPrice: String(maxPrice),
        minBeds: String(minBeds),
        page: String(page),
      });
      const res = await fetch(`/api/listings?${params}`);
      if (!res.ok) throw new Error("Failed to load listings");
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Couldn't load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [city, minPrice, maxPrice, minBeds, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilter = () => {
    setPage(1);
    fetchListings();
  };

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--white)" }}>
        {/* Page Header */}
        <div style={{
          background: "var(--green-deep)",
          color: "#fff",
          padding: "5rem 5rem 3rem",
        }}>
          <p style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "0.75rem",
          }}>
            Northern Colorado MLS
          </p>
          <h1 style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}>
            Search <em style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.7)" }}>Homes</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
            Live MLS data — Fort Collins, Loveland, Timnath, Windsor &amp; beyond
          </p>
        </div>

        {/* Filter Bar */}
        <div style={{
          background: "#fff",
          borderBottom: "1px solid rgba(51,153,51,0.12)",
          padding: "1.25rem 5rem",
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          alignItems: "flex-end",
        }}>
          <div className="filter-group">
            <label className="filter-label">City</label>
            <select
              className="filter-select"
              value={city}
              onChange={(e) => { setCity(e.target.value); setPage(1); }}
            >
              <option value="all">All NoCo</option>
              {NOCO_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Min Price</label>
            <select
              className="filter-select"
              value={minPrice}
              onChange={(e) => { setMinPrice(parseInt(e.target.value)); setPage(1); }}
            >
              {PRICE_OPTIONS.slice(0, -1).map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Max Price</label>
            <select
              className="filter-select"
              value={maxPrice}
              onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setPage(1); }}
            >
              {PRICE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Beds</label>
            <select
              className="filter-select"
              value={minBeds}
              onChange={(e) => { setMinBeds(parseInt(e.target.value)); setPage(1); }}
            >
              {BEDS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleFilter}
            style={{
              background: "var(--orange)",
              color: "#fff",
              border: "none",
              padding: "0.6rem 1.5rem",
              borderRadius: "2px",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              alignSelf: "flex-end",
              marginBottom: "1px",
            }}
          >
            Search
          </button>

          {result && !loading && (
            <span style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "0.75rem",
              color: "#888",
              alignSelf: "center",
              marginLeft: "auto",
            }}>
              {result.total} {result.total === 1 ? "listing" : "listings"}
            </span>
          )}
        </div>

        {/* Results */}
        <div style={{ padding: "3rem 5rem" }}>
          {loading && (
            <div style={{
              display: "flex",
              justifyContent: "center",
              padding: "4rem",
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "0.8rem",
              color: "#888",
              letterSpacing: "0.1em",
            }}>
              Loading listings…
            </div>
          )}

          {error && (
            <div style={{
              textAlign: "center",
              padding: "4rem",
              color: "var(--orange-dark)",
              fontSize: "0.9rem",
            }}>
              {error}
            </div>
          )}

          {!loading && !error && result && result.listings.length === 0 && (
            <div style={{
              textAlign: "center",
              padding: "5rem 2rem",
            }}>
              <p style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1.5rem",
                color: "var(--green-deep)",
                marginBottom: "0.75rem",
              }}>
                No listings match your search
              </p>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>
                Try adjusting your filters or{" "}
                <a href="/contact" style={{ color: "var(--green)", textDecoration: "none", borderBottom: "1px solid" }}>
                  contact Rich
                </a>{" "}
                — he knows every pocket of the 970.
              </p>
            </div>
          )}

          {!loading && !error && result && result.listings.length > 0 && (
            <>
              <div className="search-grid">
                {result.listings.map((listing) => (
                  <MLSListingCard key={listing.ListingKey} listing={listing} />
                ))}
              </div>

              {/* Pagination */}
              {result.pages > 1 && (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "3rem",
                  flexWrap: "wrap",
                }}>
                  {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      style={{
                        padding: "0.5rem 1rem",
                        border: p === page ? "2px solid var(--green)" : "1px solid #ddd",
                        borderRadius: "2px",
                        background: p === page ? "var(--green)" : "#fff",
                        color: p === page ? "#fff" : "#555",
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <Footer />
      </main>

      <style>{`
        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .filter-label {
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
        }
        .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(51,153,51,0.2);
          border-radius: 2px;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.875rem;
          color: var(--neutral);
          background: #fff;
          cursor: pointer;
          outline: none;
        }
        .filter-select:focus {
          border-color: var(--green);
        }
        .search-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 1100px) {
          .search-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .search-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 900px) {
          .filter-select { font-size: 0.8rem; }
        }
      `}</style>
    </>
  );
}
