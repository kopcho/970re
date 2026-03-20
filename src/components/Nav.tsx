"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="site-nav">
        <Link href="/" className="wordmark">
          970<span className="wordmark-accent">.re</span>
        </Link>

        <ul className="nav-links-list">
          <li><Link href="/buy" className="nav-link">Buy</Link></li>
          <li><Link href="/sell" className="nav-link">Sell</Link></li>
          <li><Link href="/communities" className="nav-link">Communities</Link></li>
          <li><Link href="/about" className="nav-link">About Rich</Link></li>
          <li>
            <Link href="/contact" className="nav-cta">Get Started</Link>
          </li>
        </ul>

        <button
          className="hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className={`hamburger-line ${menuOpen ? "open-1" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open-2" : ""}`} />
          <span className={`hamburger-line ${menuOpen ? "open-3" : ""}`} />
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-label="Mobile navigation">
          <ul className="mobile-nav-list">
            <li><Link href="/buy" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Buy</Link></li>
            <li><Link href="/sell" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Sell</Link></li>
            <li><Link href="/communities" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Communities</Link></li>
            <li><Link href="/about" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>About Rich</Link></li>
            <li>
              <Link href="/contact" className="mobile-nav-cta" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </li>
          </ul>
        </div>
      )}

      <style>{`
        .site-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 3rem;
          background: rgba(250,253,249,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(51,153,51,0.15);
        }
        .wordmark {
          font-family: var(--font-dm-mono), monospace;
          font-size: 1.6rem;
          font-weight: 500;
          letter-spacing: -0.04em;
          text-decoration: none;
          color: var(--green-dark);
          line-height: 1;
        }
        .wordmark-accent { color: var(--green); }
        .nav-links-list {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          align-items: center;
        }
        .nav-link {
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--neutral);
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .nav-link:hover { color: var(--green); }
        .nav-cta {
          background: var(--orange);
          color: #fff !important;
          padding: 0.6rem 1.4rem;
          border-radius: 2px;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.875rem;
          letter-spacing: 0.02em;
          display: inline-block;
          transition: background 0.2s;
        }
        .nav-cta:hover { background: var(--orange-dark) !important; }

        /* Hamburger button — hidden on desktop */
        .hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          z-index: 110;
        }
        .hamburger-line {
          display: block;
          width: 24px;
          height: 2px;
          background: var(--green-dark);
          border-radius: 2px;
          transition: transform 0.25s, opacity 0.25s;
        }
        .hamburger-line.open-1 { transform: translateY(7px) rotate(45deg); }
        .hamburger-line.open-2 { opacity: 0; }
        .hamburger-line.open-3 { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile menu overlay */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 64px;
          left: 0; right: 0;
          z-index: 99;
          background: rgba(250,253,249,0.97);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(51,153,51,0.15);
          padding: 1.5rem 1.5rem 2rem;
        }
        .mobile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mobile-nav-link {
          display: block;
          padding: 0.85rem 0.5rem;
          text-decoration: none;
          font-size: 1.05rem;
          font-weight: 500;
          color: var(--neutral);
          letter-spacing: 0.01em;
          border-bottom: 1px solid rgba(51,153,51,0.1);
          transition: color 0.2s;
        }
        .mobile-nav-link:hover { color: var(--green); }
        .mobile-nav-cta {
          display: inline-block;
          margin-top: 1rem;
          background: var(--orange);
          color: #fff;
          padding: 0.75rem 1.75rem;
          border-radius: 2px;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.95rem;
          letter-spacing: 0.02em;
          transition: background 0.2s;
        }
        .mobile-nav-cta:hover { background: var(--orange-dark); }

        @media (max-width: 900px) {
          .site-nav { padding: 1rem 1.5rem; }
          .nav-links-list { display: none; }
          .hamburger { display: flex; }
          .mobile-menu { display: block; }
        }
      `}</style>
    </>
  );
}
