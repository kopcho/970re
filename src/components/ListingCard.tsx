export interface Listing {
  price: string;
  address: string;
  city: string;
  beds: number;
  baths: number;
  sqft: string;
  acres: string;
  status: "Active" | "Pending" | "Sold";
  gradientId: string;
  gradientStart: string;
  gradientEnd: string;
  svgVariant: 1 | 2 | 3;
}

function ListingImage({ listing }: { listing: Listing }) {
  const { gradientId, gradientStart, gradientEnd, svgVariant } = listing;

  if (svgVariant === 1) {
    return (
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: gradientStart }} />
            <stop offset="100%" style={{ stopColor: gradientEnd }} />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill={`url(#${gradientId})`} />
        <rect x="80" y="90" width="160" height="90" fill="rgba(255,255,255,0.1)" rx="2" />
        <polygon points="80,90 160,40 240,90" fill="rgba(255,255,255,0.15)" />
        <rect x="140" y="130" width="40" height="50" fill="rgba(255,255,255,0.12)" />
        <rect x="90" y="100" width="30" height="25" fill="rgba(255,255,255,0.08)" rx="1" />
        <rect x="175" y="100" width="30" height="25" fill="rgba(255,255,255,0.08)" rx="1" />
        <polygon points="0,200 100,80 200,140 300,60 400,120 400,200" fill="rgba(0,0,0,0.2)" />
      </svg>
    );
  }

  if (svgVariant === 2) {
    return (
      <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: gradientStart }} />
            <stop offset="100%" style={{ stopColor: gradientEnd }} />
          </linearGradient>
        </defs>
        <rect width="400" height="200" fill={`url(#${gradientId})`} />
        <rect x="50" y="80" width="300" height="110" fill="rgba(255,255,255,0.08)" rx="2" />
        <rect x="50" y="80" width="300" height="30" fill="rgba(255,255,255,0.1)" />
        <rect x="70" y="120" width="50" height="70" fill="rgba(255,255,255,0.1)" />
        <rect x="140" y="120" width="50" height="70" fill="rgba(255,255,255,0.1)" />
        <rect x="210" y="120" width="50" height="70" fill="rgba(255,255,255,0.1)" />
        <polygon points="0,200 150,60 300,130 400,90 400,200" fill="rgba(0,0,0,0.25)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: gradientStart }} />
          <stop offset="100%" style={{ stopColor: gradientEnd }} />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${gradientId})`} />
      <rect x="100" y="85" width="200" height="115" fill="rgba(255,255,255,0.1)" rx="1" />
      <polygon points="100,85 200,35 300,85" fill="rgba(255,255,255,0.12)" />
      <rect x="160" y="135" width="45" height="65" fill="rgba(255,255,255,0.1)" />
      <rect x="110" y="100" width="35" height="28" fill="rgba(255,255,255,0.08)" />
      <rect x="220" y="100" width="35" height="28" fill="rgba(255,255,255,0.08)" />
      <rect x="0" y="150" width="400" height="50" fill="rgba(0,0,0,0.15)" />
    </svg>
  );
}

function badgeClass(status: Listing["status"]) {
  if (status === "Pending") return "listing-badge listing-badge--pending";
  if (status === "Sold") return "listing-badge listing-badge--sold";
  return "listing-badge";
}

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <>
      <a href="#" className="listing-card">
        <div className="listing-img">
          <ListingImage listing={listing} />
          <span className={badgeClass(listing.status)}>{listing.status}</span>
        </div>
        <div className="listing-info">
          <div className="listing-price">{listing.price}</div>
          <div className="listing-address">{listing.address} · {listing.city}</div>
          <div className="listing-specs">
            <span>{listing.beds} bd</span>
            <span>{listing.baths} ba</span>
            <span>{listing.sqft} sqft</span>
            <span>{listing.acres} ac</span>
          </div>
        </div>
      </a>

      <style>{`
        .listing-card {
          border-radius: 3px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26,77,26,0.12);
        }
        .listing-img {
          height: 200px;
          position: relative;
          overflow: hidden;
        }
        .listing-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          background: var(--green);
          color: #fff;
          font-size: 0.7rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border-radius: 1px;
        }
        .listing-badge--sold { background: var(--neutral); }
        .listing-badge--pending { background: var(--orange); }
        .listing-info {
          padding: 1.25rem;
          background: #fff;
          border: 1px solid rgba(51,153,51,0.1);
          border-top: none;
        }
        .listing-price {
          font-family: var(--font-fraunces), serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--green-deep);
          margin-bottom: 0.3rem;
        }
        .listing-address {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.75rem;
        }
        .listing-specs {
          display: flex;
          gap: 1rem;
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.75rem;
          color: #888;
        }
        .listing-specs span { white-space: nowrap; }
      `}</style>
    </>
  );
}
