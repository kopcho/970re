"use client";

import { useState } from "react";
import Link from "next/link";
import AddressAutocomplete from "@/components/AddressAutocomplete";

export default function ValuationPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "valuation", ...form }),
    });
    setStatus(res.ok ? "done" : "error");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid rgba(51,153,51,0.25)",
    borderRadius: "2px",
    padding: "0.9rem 1rem",
    fontFamily: "var(--font-dm-sans), sans-serif",
    fontSize: "1rem",
    color: "var(--neutral)",
    background: "#fff",
    outline: "none",
    marginBottom: "1rem",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--white)", padding: "8rem 2rem 6rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ maxWidth: "560px", width: "100%" }}>
        <p style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green)", marginBottom: "1.5rem" }}>
          Free Home Valuation
        </p>
        <h1 style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, color: "var(--green-deep)", lineHeight: 1.05, marginBottom: "0.75rem" }}>
          What&apos;s your home <em style={{ fontStyle: "italic", fontWeight: 300, color: "var(--green)" }}>actually worth?</em>
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "#4a5a4a", marginBottom: "2.5rem" }}>
          Not a Zestimate. A real, data-backed valuation from someone who knows this market. Rich will follow up personally.
        </p>

        {status === "done" ? (
          <div style={{ background: "var(--green-light)", border: "1.5px solid var(--green)", borderRadius: "3px", padding: "2rem", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-fraunces), serif", fontSize: "1.4rem", fontWeight: 700, color: "var(--green-deep)", marginBottom: "0.5rem" }}>Got it — thanks.</p>
            <p style={{ color: "#4a5a4a", marginBottom: "1.5rem" }}>Rich will be in touch shortly with your valuation.</p>
            <Link href="/" style={{ color: "var(--green)", textDecoration: "none", borderBottom: "1px solid var(--green)", fontSize: "0.9rem" }}>← Back to Home</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input style={inputStyle} type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            <input style={inputStyle} type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} required />
            <input style={inputStyle} type="tel" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} />
            <AddressAutocomplete value={form.address} onChange={(v) => setForm(f => ({ ...f, address: v }))} style={inputStyle} required />
            {status === "error" && (
              <p style={{ color: "var(--orange-dark)", marginBottom: "1rem", fontSize: "0.9rem" }}>Something went wrong — please try again or call Rich at (970) 669-8677.</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ background: "var(--orange)", color: "#fff", border: "none", padding: "1rem 2rem", fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "0.95rem", fontWeight: 500, cursor: "pointer", borderRadius: "2px", width: "100%", opacity: status === "sending" ? 0.7 : 1 }}
            >
              {status === "sending" ? "Sending…" : "Get My Free Home Value →"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
