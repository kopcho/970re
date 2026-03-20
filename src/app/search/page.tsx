"use client";

import { useState } from "react";
import Link from "next/link";

export default function SearchPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
        textAlign: "center",
      }}
    >
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
        Coming Soon
      </p>

      <h1
        style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          fontWeight: 900,
          color: "var(--green-deep)",
          marginBottom: "1rem",
          lineHeight: 1.1,
        }}
      >
        MLS Search{" "}
        <em
          style={{
            fontStyle: "italic",
            fontWeight: 300,
            color: "var(--green)",
          }}
        >
          Powered by MLSpy
        </em>
      </h1>

      <p
        style={{
          fontSize: "1.05rem",
          color: "#4a5a4a",
          lineHeight: 1.7,
          maxWidth: "480px",
          marginBottom: "3rem",
        }}
      >
        Full MLS search for Northern Colorado is coming soon. Enter your email to be notified when it&apos;s live.
      </p>

      {submitted ? (
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            color: "var(--green)",
            fontSize: "1rem",
            letterSpacing: "0.05em",
          }}
        >
          You&apos;re on the list — we&apos;ll be in touch!
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "0",
            maxWidth: "480px",
            width: "100%",
            borderRadius: "3px",
            overflow: "hidden",
            boxShadow: "0 2px 20px rgba(26,77,26,0.1)",
          }}
        >
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "1rem 1.25rem",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "1rem",
              color: "var(--neutral)",
              background: "#fff",
              borderTop: "1px solid rgba(51,153,51,0.15)",
              borderBottom: "1px solid rgba(51,153,51,0.15)",
              borderLeft: "1px solid rgba(51,153,51,0.15)",
            }}
          />
          <button
            type="submit"
            style={{
              background: "var(--orange)",
              color: "#fff",
              border: "none",
              padding: "1rem 1.5rem",
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Notify Me
          </button>
        </form>
      )}

      <Link
        href="/"
        style={{
          marginTop: "3rem",
          fontSize: "0.875rem",
          color: "var(--green)",
          textDecoration: "none",
          borderBottom: "1px solid var(--green)",
          paddingBottom: "1px",
        }}
      >
        ← Back to Home
      </Link>
    </main>
  );
}
