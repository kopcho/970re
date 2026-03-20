"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section
      style={{
        background: "var(--green-dark)",
        padding: "3rem 5rem",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.5)",
          marginBottom: "1rem",
        }}
      >
        Search homes in Northern Colorado
      </p>
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderRadius: "3px",
          overflow: "hidden",
          maxWidth: "700px",
        }}
      >
        <input
          type="text"
          placeholder="City, zip code, neighborhood, or address…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            padding: "1.1rem 1.5rem",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "1rem",
            color: "var(--neutral)",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            background: "var(--orange)",
            color: "#fff",
            border: "none",
            padding: "0 2rem",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "0.9rem",
            fontWeight: 500,
            cursor: "pointer",
            letterSpacing: "0.03em",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--orange-dark)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--orange)";
          }}
        >
          Search →
        </button>
      </div>
    </section>
  );
}
