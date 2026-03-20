import Link from "next/link";
import ListingCard, { Listing } from "./ListingCard";

interface ListingsGridProps {
  listings: Listing[];
}

export default function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <>
      <section className="listings-section">
        <div className="section-header">
          <h2 className="section-title">
            Featured <em className="section-em">Listings</em>
          </h2>
          <Link href="/search" className="section-link">View all homes →</Link>
        </div>

        <div className="listings-grid">
          {listings.map((listing, i) => (
            <ListingCard key={i} listing={listing} />
          ))}
        </div>
      </section>

      <style>{`
        .listings-section {
          padding: 6rem 5rem;
          background: var(--white);
        }
        .section-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .section-title {
          font-family: var(--font-fraunces), serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--green-deep);
        }
        .section-em {
          font-style: italic;
          font-weight: 300;
          color: var(--green);
        }
        .section-link {
          font-size: 0.875rem;
          color: var(--green);
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.02em;
          border-bottom: 1px solid var(--green);
          padding-bottom: 1px;
        }
        .listings-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .listings-section { padding: 4rem 2rem; }
          .listings-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
