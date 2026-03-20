import Link from "next/link";
import MLSListingCard from "./MLSListingCard";
import { fetchMLSListings, NOCO_CITIES } from "@/lib/mls";

export default async function FeaturedListings() {
  let listings: Awaited<ReturnType<typeof fetchMLSListings>> = [];

  try {
    const all = await fetchMLSListings({ status: "Active", withMedia: true, top: 200 });
    const noco = all.filter((l) => NOCO_CITIES.includes(l.City));
    // Show 3 most expensive active NoCo listings
    listings = noco.sort((a, b) => b.ListPrice - a.ListPrice).slice(0, 3);
  } catch {
    // Fall through — show nothing if API fails
  }

  if (listings.length === 0) return null;

  return (
    <>
      <section className="featured-section">
        <div className="featured-header">
          <h2 className="featured-title">
            Featured <em className="featured-em">Listings</em>
          </h2>
          <Link href="/search" className="featured-link">View all homes →</Link>
        </div>

        <div className="featured-grid">
          {listings.map((listing) => (
            <MLSListingCard key={listing.ListingKey} listing={listing} />
          ))}
        </div>
      </section>

      <style>{`
        .featured-section {
          padding: 6rem 5rem;
          background: var(--white);
        }
        .featured-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 3rem;
        }
        .featured-title {
          font-family: var(--font-fraunces), serif;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--green-deep);
        }
        .featured-em {
          font-style: italic;
          font-weight: 300;
          color: var(--green);
        }
        .featured-link {
          font-size: 0.875rem;
          color: var(--green);
          text-decoration: none;
          font-weight: 500;
          letter-spacing: 0.02em;
          border-bottom: 1px solid var(--green);
          padding-bottom: 1px;
        }
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .featured-section { padding: 4rem 2rem; }
          .featured-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
