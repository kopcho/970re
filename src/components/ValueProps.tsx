import Link from "next/link";

const valueCards = [
  {
    icon: "🏔️",
    title: "Local Expertise",
    text: "50 years of Northern Colorado transactions. Every neighborhood, every market cycle.",
  },
  {
    icon: "🔍",
    title: "Smart Search",
    text: "AI-powered MLS access. Find exactly what you need, faster than any portal.",
  },
  {
    icon: "📊",
    title: "Market Insight",
    text: "Real-time data, honest analysis. Know what a home is really worth before you offer.",
  },
  {
    icon: "🤝",
    title: "Full Service",
    text: "Buy, sell, invest. BHGRE Neuhaus-backed with everything you need under one roof.",
  },
];

export default function ValueProps() {
  return (
    <>
      <section className="value-section">
        <div className="value-left">
          <h2 className="value-headline">
            Deep roots.<br />
            <em className="value-em">Real results.</em>
          </h2>
          <p className="value-text">
            50 years in the 970 means knowing which streets flood in spring, which subdivisions have HOA issues, and where the hidden gems are before they hit the market. That&apos;s the difference between a transaction and the right move.
          </p>
          <Link href="/contact" className="btn-primary-value">Talk to Rich →</Link>
        </div>

        <div className="value-right">
          {valueCards.map((card, i) => (
            <div key={i} className="value-card">
              <div className="value-icon">{card.icon}</div>
              <div className="value-card-title">{card.title}</div>
              <div className="value-card-text">{card.text}</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .value-section {
          background: var(--green-light);
          padding: 6rem 5rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .value-headline {
          font-family: var(--font-fraunces), serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--green-deep);
          margin-bottom: 1.5rem;
        }
        .value-em {
          font-style: italic;
          font-weight: 300;
          color: var(--green);
        }
        .value-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #4a5a4a;
          margin-bottom: 2rem;
        }
        .btn-primary-value {
          background: var(--orange);
          color: #fff;
          border: none;
          padding: 1rem 2rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          cursor: pointer;
          border-radius: 2px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary-value:hover { background: var(--orange-dark); transform: translateY(-1px); }
        .value-right {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }
        .value-card {
          background: #fff;
          border-radius: 3px;
          padding: 1.75rem;
          border-left: 3px solid var(--green);
        }
        .value-icon {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .value-card-title {
          font-family: var(--font-fraunces), serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--green-deep);
          margin-bottom: 0.5rem;
        }
        .value-card-text {
          font-size: 0.85rem;
          line-height: 1.6;
          color: #666;
        }
        @media (max-width: 900px) {
          .value-section {
            grid-template-columns: 1fr;
            padding: 4rem 2rem;
            gap: 3rem;
          }
        }
      `}</style>
    </>
  );
}
