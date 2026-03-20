import Link from "next/link";

export default function CTAStrip() {
  return (
    <>
      <section className="cta-strip">
        <div className="cta-glow" />
        <h2 className="cta-headline">
          What&apos;s your home<br />
          <em className="cta-em">actually worth?</em>
        </h2>
        <p className="cta-sub">Get a real, data-backed valuation — not a Zestimate.</p>
        <Link href="/valuation" className="btn-primary-cta">Get My Free Home Value</Link>
      </section>

      <style>{`
        .cta-strip {
          background: var(--green-deep);
          padding: 5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .cta-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(51,153,51,0.15) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-headline {
          font-family: var(--font-fraunces), serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 900;
          color: #fff;
          margin-bottom: 1rem;
          position: relative;
        }
        .cta-em {
          font-style: italic;
          font-weight: 300;
          color: var(--green);
        }
        .cta-sub {
          color: rgba(255,255,255,0.65);
          font-size: 1.1rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .btn-primary-cta {
          background: var(--orange);
          color: #fff;
          border: none;
          padding: 1.1rem 2.5rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          border-radius: 2px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, transform 0.15s;
          position: relative;
        }
        .btn-primary-cta:hover { background: var(--orange-dark); transform: translateY(-1px); }
        @media (max-width: 900px) {
          .cta-strip { padding: 4rem 2rem; }
        }
      `}</style>
    </>
  );
}
