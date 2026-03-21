"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const AI_EXAMPLES = [
  "3bd 2ba with a 3-car garage and 5 acres along I-25",
  "Affordable starter home in Fort Collins under $400K",
  "4 bedroom with a big shop for a contractor in Loveland",
  "Investment property near CSU with rental income potential",
];

interface SearchResult {
  listings: MLSListing[];
  total: number;
  pages: number;
}

interface AIResult {
  listings: MLSListing[];
  total: number;
  summary: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Message = Record<string, any>;

export default function SearchPage() {
  // Tab state
  const [mode, setMode] = useState<"ai" | "filter">("ai");

  // AI search state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Conversation state — persists across refinement queries
  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const isConversation = conversationMessages.length > 0;

  // Filter search state
  const [city, setCity] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minBeds, setMinBeds] = useState(0);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Warm the MLS cache as soon as the page loads
  useEffect(() => {
    fetch("/api/listings?city=all&page=1").catch(() => {});
  }, []);

  const resetConversation = () => {
    setConversationMessages([]);
    setAiResult(null);
    setAiQuery("");
    setAiError("");
  };

  // AI search handler — passes conversation history for refinement
  const handleAISearch = async (queryOverride?: string) => {
    const q = queryOverride ?? aiQuery;
    if (!q.trim()) return;
    setAiQuery(q);
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          messages: conversationMessages.length > 0 ? conversationMessages : undefined,
        }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setAiResult(data);
      // Store conversation history for next refinement
      if (data.messages) setConversationMessages(data.messages);
    } catch {
      setAiError("Couldn't complete the search. Please try again.");
    } finally {
      setAiLoading(false);
      setAiQuery("");
    }
  };

  // Filter search handler
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        city, minPrice: String(minPrice), maxPrice: String(maxPrice),
        minBeds: String(minBeds), page: String(page),
      });
      const res = await fetch(`/api/listings?${params}`);
      if (!res.ok) throw new Error("Failed to load listings");
      setResult(await res.json());
    } catch {
      setError("Couldn't load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [city, minPrice, maxPrice, minBeds, page]);

  useEffect(() => {
    if (mode === "filter") fetchListings();
  }, [mode, fetchListings]);

  const noResults = (data: SearchResult | AIResult | null) =>
    data && data.listings.length === 0;

  return (
    <>
      <main style={{ minHeight: "100vh", background: "var(--white)" }}>
        {/* Page Header */}
        <div style={{
          background: "var(--green-deep)",
          color: "#fff",
          padding: "5rem 5rem 0",
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
            marginBottom: "2rem",
          }}>
            Search <em style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(255,255,255,0.7)" }}>Homes</em>
          </h1>

          {/* Mode Tabs */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            {(["ai", "filter"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "transparent",
                  border: "none",
                  borderBottom: mode === m ? "2px solid var(--orange)" : "2px solid transparent",
                  color: mode === m ? "#fff" : "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  marginBottom: "-1px",
                }}
              >
                {m === "ai" ? "AI Search" : "Filter"}
              </button>
            ))}
          </div>
        </div>

        {/* ── AI SEARCH MODE ── */}
        {mode === "ai" && (
          <div style={{ padding: "2.5rem 5rem 0" }}>

            {/* Conversation context bar */}
            {isConversation && aiResult && (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                maxWidth: "760px", marginBottom: "0.75rem",
                padding: "0.5rem 0.75rem",
                background: "rgba(51,153,51,0.06)",
                borderRadius: "2px",
                border: "1px solid rgba(51,153,51,0.12)",
              }}>
                <span style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.7rem", letterSpacing: "0.08em", color: "var(--green)",
                }}>
                  ↳ Refining {aiResult.total} {aiResult.total === 1 ? "result" : "results"} — type to narrow further
                </span>
                <button
                  onClick={resetConversation}
                  style={{
                    background: "transparent", border: "none",
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: "0.65rem", letterSpacing: "0.08em",
                    color: "#aaa", cursor: "pointer", textDecoration: "underline",
                  }}
                >
                  Start over
                </button>
              </div>
            )}

            {/* Search input */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleAISearch(); }}
              style={{
                display: "flex",
                gap: 0,
                maxWidth: "760px",
                borderRadius: "3px",
                overflow: "hidden",
                boxShadow: "0 2px 20px rgba(26,77,26,0.1)",
                border: isConversation ? "1.5px solid rgba(51,153,51,0.4)" : "1.5px solid rgba(51,153,51,0.2)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder={isConversation ? "Refine further… or ask something new" : "Describe what you're looking for in plain English…"}
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  padding: "1rem 1.25rem",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "1rem",
                  color: "var(--neutral)",
                  background: "#fff",
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                disabled={aiLoading || !aiQuery.trim()}
                style={{
                  background: aiLoading ? "#ccc" : "var(--orange)",
                  color: "#fff",
                  border: "none",
                  padding: "1rem 1.5rem",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: aiLoading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {aiLoading ? "Searching…" : "Search"}
              </button>
            </form>

            {/* Example prompts */}
            {!aiResult && !aiLoading && (
              <div style={{ marginTop: "1.5rem", maxWidth: "760px" }}>
                <p style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#aaa",
                  marginBottom: "0.75rem",
                }}>
                  Try these
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {AI_EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => handleAISearch(ex)}
                      style={{
                        background: "transparent",
                        border: "1px solid rgba(51,153,51,0.2)",
                        borderRadius: "999px",
                        padding: "0.4rem 0.9rem",
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        fontSize: "0.8rem",
                        color: "var(--green)",
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI loading state — skeleton grid */}
            {aiLoading && (
              <div style={{ marginTop: "2rem", paddingBottom: "4rem" }}>
                {/* Pulsing status line */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "#888",
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  marginBottom: "2rem",
                }}>
                  <span className="ai-spinner" />
                  Searching the 970 MLS…
                </div>
                {/* Skeleton cards */}
                <div className="search-grid">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton-card">
                      <div className="skeleton-img" />
                      <div style={{ padding: "1.25rem", background: "#fff", border: "1px solid rgba(51,153,51,0.1)", borderTop: "none" }}>
                        <div className="skeleton-line" style={{ width: "60%", height: 24, marginBottom: "0.5rem" }} />
                        <div className="skeleton-line" style={{ width: "85%", height: 14, marginBottom: "0.75rem" }} />
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <div className="skeleton-line" style={{ width: 40, height: 12 }} />
                          <div className="skeleton-line" style={{ width: 40, height: 12 }} />
                          <div className="skeleton-line" style={{ width: 60, height: 12 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* AI error */}
            {aiError && (
              <p style={{ marginTop: "2rem", color: "var(--orange-dark)", fontSize: "0.9rem" }}>
                {aiError}
              </p>
            )}

            {/* AI results */}
            {aiResult && !aiLoading && (
              <div style={{ marginTop: "2rem", paddingBottom: "4rem" }}>
                {/* Claude's explanation */}
                <div style={{
                  background: "var(--green-light)",
                  border: "1px solid rgba(51,153,51,0.15)",
                  borderRadius: "3px",
                  padding: "1rem 1.25rem",
                  marginBottom: "2rem",
                  maxWidth: "760px",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "1.1rem", lineHeight: 1.4 }}>✦</span>
                  <div>
                    <p style={{ fontSize: "0.9rem", color: "var(--green-deep)", lineHeight: 1.6, margin: 0 }}>
                      {aiResult.summary}
                    </p>
                    <p style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: "0.65rem",
                      color: "#aaa",
                      marginTop: "0.4rem",
                      letterSpacing: "0.06em",
                    }}>
                      {aiResult.total} {aiResult.total === 1 ? "listing" : "listings"} found
                    </p>
                  </div>
                </div>

                {noResults(aiResult) ? (
                  <div style={{ textAlign: "center", padding: "3rem 0" }}>
                    <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", color: "var(--green-deep)", marginBottom: "0.5rem" }}>
                      No exact matches
                    </p>
                    <p style={{ color: "#888", fontSize: "0.9rem" }}>
                      Try adjusting your description or{" "}
                      <a href="/contact" style={{ color: "var(--green)", textDecoration: "none", borderBottom: "1px solid" }}>
                        ask Rich directly
                      </a>.
                    </p>
                  </div>
                ) : (
                  <div className="search-grid">
                    {aiResult.listings.map((listing) => (
                      <MLSListingCard key={listing.ListingKey} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── FILTER MODE ── */}
        {mode === "filter" && (
          <>
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
                <select className="filter-select" value={city} onChange={(e) => { setCity(e.target.value); setPage(1); }}>
                  <option value="all">All NoCo</option>
                  {NOCO_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Min Price</label>
                <select className="filter-select" value={minPrice} onChange={(e) => { setMinPrice(parseInt(e.target.value)); setPage(1); }}>
                  {PRICE_OPTIONS.slice(0, -1).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Max Price</label>
                <select className="filter-select" value={maxPrice} onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setPage(1); }}>
                  {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Beds</label>
                <select className="filter-select" value={minBeds} onChange={(e) => { setMinBeds(parseInt(e.target.value)); setPage(1); }}>
                  {BEDS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>

              <button
                onClick={fetchListings}
                style={{
                  background: "var(--orange)", color: "#fff", border: "none",
                  padding: "0.6rem 1.5rem", borderRadius: "2px",
                  fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.875rem",
                  fontWeight: 500, cursor: "pointer", alignSelf: "flex-end", marginBottom: "1px",
                }}
              >
                Search
              </button>

              {result && !loading && (
                <span style={{
                  fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.75rem",
                  color: "#888", alignSelf: "center", marginLeft: "auto",
                }}>
                  {result.total} {result.total === 1 ? "listing" : "listings"}
                </span>
              )}
            </div>

            <div style={{ padding: "3rem 5rem" }}>
              {loading && (
                <div style={{
                  display: "flex", justifyContent: "center", padding: "4rem",
                  fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.8rem",
                  color: "#888", letterSpacing: "0.1em",
                }}>
                  Loading listings…
                </div>
              )}

              {error && (
                <div style={{ textAlign: "center", padding: "4rem", color: "var(--orange-dark)", fontSize: "0.9rem" }}>
                  {error}
                </div>
              )}

              {!loading && !error && noResults(result) && (
                <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
                  <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.5rem", color: "var(--green-deep)", marginBottom: "0.75rem" }}>
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

                  {result.pages > 1 && (
                    <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
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
          </>
        )}

        <Footer />
      </main>

      <style>{`
        .filter-group { display: flex; flex-direction: column; gap: 0.3rem; }
        .filter-label {
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.65rem; letter-spacing: 0.12em; text-transform: uppercase; color: #888;
        }
        .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid rgba(51,153,51,0.2); border-radius: 2px;
          font-family: var(--font-dm-sans), sans-serif; font-size: 0.875rem;
          color: var(--neutral); background: #fff; cursor: pointer; outline: none;
        }
        .filter-select:focus { border-color: var(--green); }
        .search-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .ai-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(51,153,51,0.2);
          border-top-color: var(--green);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .skeleton-card {
          border-radius: 3px;
          overflow: hidden;
        }
        .skeleton-img {
          height: 220px;
          background: linear-gradient(90deg, #e0ebe0 25%, #edf4ed 50%, #e0ebe0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skeleton-line {
          border-radius: 2px;
          background: linear-gradient(90deg, #e8ede8 25%, #f2f5f2 50%, #e8ede8 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @media (max-width: 1100px) { .search-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 700px) { .search-grid { grid-template-columns: 1fr; } }
        @media (max-width: 900px) {
          .filter-select { font-size: 0.8rem; }
        }
      `}</style>
    </>
  );
}
