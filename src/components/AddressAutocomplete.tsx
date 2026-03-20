"use client";

import { useState, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  required?: boolean;
}

export default function AddressAutocomplete({ value, onChange, style, required }: Props) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const validateAddress = async (input: string) => {
    if (!input.trim() || input.length < 8) return;
    setChecking(true);
    setSuggestion(null);
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&components=country:US&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
      );
      const data = await res.json();
      const result = data.results?.[0];
      if (result && result.formatted_address && result.formatted_address !== input) {
        setSuggestion(result.formatted_address);
      }
    } catch {
      // silent fail — don't block form submission
    } finally {
      setChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSuggestion(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const handleBlur = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => validateAddress(value), 300);
  };

  const acceptSuggestion = () => {
    onChange(suggestion!);
    setSuggestion(null);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="text"
        placeholder="Property address"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        required={required}
        style={{ ...style, marginBottom: 0 }}
        autoComplete="off"
      />
      {checking && (
        <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.4rem" }}>
          Verifying address…
        </p>
      )}
      {suggestion && (
        <div style={{
          marginTop: "0.5rem",
          padding: "0.75rem 1rem",
          background: "var(--green-light)",
          border: "1.5px solid var(--green)",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <span style={{ fontSize: "0.875rem", color: "var(--green-deep)" }}>
            ✓ Verified: <strong>{suggestion}</strong>
          </span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              onClick={acceptSuggestion}
              style={{
                background: "var(--green)",
                color: "#fff",
                border: "none",
                padding: "0.35rem 0.85rem",
                borderRadius: "2px",
                fontSize: "0.8rem",
                fontFamily: "var(--font-dm-sans), sans-serif",
                cursor: "pointer",
              }}
            >
              Use this
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              style={{
                background: "transparent",
                color: "#888",
                border: "1px solid #ccc",
                padding: "0.35rem 0.85rem",
                borderRadius: "2px",
                fontSize: "0.8rem",
                fontFamily: "var(--font-dm-sans), sans-serif",
                cursor: "pointer",
              }}
            >
              Keep mine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
