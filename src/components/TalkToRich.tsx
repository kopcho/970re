"use client";

import Link from "next/link";
import { useState } from "react";

export default function TalkToRich() {
  const [hovered, setHovered] = useState(false);

  return (
    <>
      <Link
        href="sms:+19706698677"
        className="talk-to-rich-btn"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Call Rich Kopcho, Northern Colorado real estate broker"
        style={{
          background: hovered ? "var(--orange-dark)" : "var(--orange)",
        }}
      >
        Talk to Rich →
      </Link>

      <style>{`
        .talk-to-rich-btn {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 200;
          display: inline-block;
          padding: 0.85rem 1.6rem;
          border-radius: 999px;
          background: var(--orange);
          color: #fff;
          font-family: var(--font-dm-sans), 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(255, 107, 53, 0.4);
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .talk-to-rich-btn:hover {
          box-shadow: 0 6px 20px rgba(224, 84, 30, 0.5);
          transform: translateY(-1px);
        }
        @media (max-width: 600px) {
          .talk-to-rich-btn {
            bottom: 1.25rem;
            right: 1.25rem;
            font-size: 0.85rem;
            padding: 0.75rem 1.25rem;
          }
        }
      `}</style>
    </>
  );
}
