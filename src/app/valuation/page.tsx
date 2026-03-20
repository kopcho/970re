"use client";

import { useState } from "react";
import Link from "next/link";

export default function ValuationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    border: "1px solid rgba(51,153,51,0.25)",
    outline: "none",
    padding: "0.9rem 1.1rem",
    fontFamily: "var(--font-dm-sans), sans-serif",
    fontSize: "1rem",
    color: "var(--neutral)",
    background: "#fff",
    borderRadius: "2px",
    marginBottom: "1rem",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--white)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem",
      }}
    >
      <div style={{ maxWidth: "560px", width: "100%" }}>
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--green)",
            marginBottom: "1.5rem",
          }}
        >
          Free Home Valuation
        </p>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 900,
            color: "var(--green-deep)",
            marginBottom: "1rem",
            lineHeight: 1.1,
          }}
        >
          Get Your{" "}
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--green)",
            }}
          >
            Free Home Valuation
          </em>
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            color: "#4a5a4a",
            lineHeight: 1.7,
            marginBottom: "2.5rem",
          }}
        >
          A real, data-backed market analysis from Rich Kopcho — not an algorithm.
        </p>

        {submitted ? (
          <div
            style={{
              background: "var(--green-light)",
              border: "1px solid rgba(51,153,51,0.3)",
              borderRadius: "3px",
              padding: "2rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--green-deep)",
                marginBottom: "0.75rem",
              }}
            >
              Request received!
            </p>
            <p style={{ color: "#4a5a4a", fontSize: "0.95rem" }}>
              Rich will be in touch within 24 hours with your home valuation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              value={form.phone}
              onChange={handleChange}
              style={inputStyle}
            />
            <input
              type="text"
              name="address"
              placeholder="Property address"
              value={form.address}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                background: "var(--orange)",
                color: "#fff",
                border: "none",
                padding: "1.1rem",
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer",
                borderRadius: "2px",
                letterSpacing: "0.02em",
                marginTop: "0.5rem",
              }}
            >
              Get My Free Valuation
            </button>
          </form>
        )}

        <Link
          href="/"
          style={{
            display: "inline-block",
            marginTop: "2.5rem",
            fontSize: "0.875rem",
            color: "var(--green)",
            textDecoration: "none",
            borderBottom: "1px solid var(--green)",
            paddingBottom: "1px",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
