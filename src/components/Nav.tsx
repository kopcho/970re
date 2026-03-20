import Link from "next/link";

export default function Nav() {
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
      </nav>

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
        @media (max-width: 900px) {
          .site-nav { padding: 1rem 1.5rem; }
          .nav-links-list { display: none; }
        }
      `}</style>
    </>
  );
}
