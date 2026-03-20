import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="hero-section">
        {/* Backgrounds */}
        <div className="hero-bg-radial" />
        <div className="hero-bg-grid" />

        {/* Left */}
        <div className="hero-left">
          <p className="hero-eyebrow">Northern Colorado Real Estate</p>

          <h1 className="hero-headline">
            Know<br />the <em className="hero-em">970.</em>
          </h1>

          <p className="hero-tagline">Home is here.</p>

          <p className="hero-sub">
            50 years of Northern Colorado real estate. From Fort Collins to Loveland, Berthoud to Wellington — nobody knows this market like we do.
          </p>

          <div className="hero-actions">
            <Link href="/search" className="btn-primary">Search Homes</Link>
            <Link href="/valuation" className="btn-secondary">Get My Home Value</Link>
          </div>
        </div>

        {/* Right — Area Card */}
        <div className="hero-right">
          <div className="area-card">
            <div className="area-card-glow" />
            <p className="area-card-label">The 970 Market · Right Now</p>

            <div className="area-stats">
              {[
                { num: "$485K", label: "Median Sale Price\nLarimer County" },
                { num: "18",    label: "Avg Days\non Market" },
                { num: "97%",   label: "List-to-Sale\nPrice Ratio" },
                { num: "340+",  label: "Active Listings\nNoCo Region" },
              ].map((stat, i) => (
                <div key={i} className="stat">
                  <div className="stat-num">{stat.num}</div>
                  <div className="stat-label" style={{ whiteSpace: "pre-line" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="area-cities">
              {["Loveland","Fort Collins","Berthoud","Longmont","Wellington","Timnath"].map((city) => (
                <span key={city} className="city-pill">{city}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .hero-section {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding-top: 80px;
          position: relative;
          overflow: hidden;
        }
        .hero-bg-radial {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 50%, rgba(51,153,51,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(26,77,26,0.05) 0%, transparent 60%);
          pointer-events: none;
        }
        .hero-bg-grid {
          position: absolute; inset: 0;
          background-image:
            repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(51,153,51,0.04) 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(51,153,51,0.04) 60px);
          pointer-events: none;
        }
        .hero-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6rem 4rem 6rem 5rem;
          position: relative;
          z-index: 1;
        }
        .hero-eyebrow {
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--green);
          margin-bottom: 1.5rem;
          animation: fadeUp 0.6s ease both;
        }
        .hero-headline {
          font-family: var(--font-fraunces), serif;
          font-size: clamp(3rem, 5vw, 5rem);
          font-weight: 900;
          line-height: 1.0;
          color: var(--green-deep);
          margin-bottom: 0.25rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .hero-em {
          font-style: italic;
          font-weight: 300;
          color: var(--green);
        }
        .hero-tagline {
          font-family: var(--font-fraunces), serif;
          font-size: clamp(1.5rem, 2.5vw, 2.2rem);
          font-weight: 300;
          font-style: italic;
          color: var(--green-dark);
          margin-bottom: 2rem;
          opacity: 0.8;
          animation: fadeUp 0.6s 0.2s ease both;
        }
        .hero-sub {
          font-size: 1.05rem;
          line-height: 1.7;
          color: #4a5a4a;
          max-width: 420px;
          margin-bottom: 3rem;
          animation: fadeUp 0.6s 0.3s ease both;
        }
        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.4s ease both;
        }
        .btn-primary {
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
        .btn-primary:hover { background: var(--orange-dark); transform: translateY(-1px); }
        .btn-secondary {
          background: transparent;
          color: var(--green-dark);
          border: 1.5px solid var(--green);
          padding: 1rem 2rem;
          font-family: var(--font-dm-sans), sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 2px;
          text-decoration: none;
          display: inline-block;
          transition: background 0.2s, color 0.2s;
        }
        .btn-secondary:hover { background: var(--green); color: #fff; }
        .hero-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6rem 4rem;
          position: relative;
          z-index: 1;
        }
        .area-card {
          background: var(--green-deep);
          border-radius: 4px;
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .area-card-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 30% 30%, rgba(51,153,51,0.2) 0%, transparent 60%);
          pointer-events: none;
        }
        .area-card-label {
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--green);
          margin-bottom: 1.5rem;
          position: relative;
        }
        .area-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          position: relative;
        }
        .stat {
          border-left: 2px solid var(--green);
          padding-left: 1rem;
        }
        .stat-num {
          font-family: var(--font-fraunces), serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.55);
          margin-top: 0.25rem;
          line-height: 1.3;
        }
        .area-cities {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          position: relative;
        }
        .city-pill {
          background: rgba(51,153,51,0.2);
          border: 1px solid rgba(51,153,51,0.4);
          color: #b8d9b8;
          font-size: 0.75rem;
          font-family: var(--font-dm-mono), monospace;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
        }
        @media (max-width: 900px) {
          .hero-section { grid-template-columns: 1fr; }
          .hero-left { padding: 5rem 2rem 3rem; }
          .hero-right { display: none; }
        }
      `}</style>
    </>
  );
}
