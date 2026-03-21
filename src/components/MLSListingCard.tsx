"use client";

import { useState } from "react";
import { MLSListing, getListingPhoto, formatPrice, formatSqft } from "@/lib/mls";

function PlaceholderImage() {
  return (
    <svg viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", display: "block" }}>
      <defs>
        <linearGradient id="ph" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#1a4d1a" }} />
          <stop offset="100%" style={{ stopColor: "#2d7a2d" }} />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ph)" />
      <rect x="100" y="100" width="200" height="130" fill="rgba(255,255,255,0.08)" rx="1" />
      <polygon points="100,100 200,50 300,100" fill="rgba(255,255,255,0.1)" />
      <rect x="165" y="155" width="45" height="75" fill="rgba(255,255,255,0.1)" />
      <rect x="110" y="115" width="35" height="28" fill="rgba(255,255,255,0.07)" />
      <rect x="220" y="115" width="35" height="28" fill="rgba(255,255,255,0.07)" />
    </svg>
  );
}

function statusBadgeStyle(status: string) {
  if (status === "Pending") return { background: "var(--orange)" };
  if (status === "Closed") return { background: "var(--neutral)" };
  return { background: "var(--green)" };
}

export default function MLSListingCard({ listing }: { listing: MLSListing }) {
  const photo = getListingPhoto(listing);
  const sqft = listing.LivingArea ?? listing.AboveGradeFinishedArea;
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <>
      <a href={`/listing/${listing.ListingKey}`} className="mls-card">
        <div className="mls-card-img">
          {/* Shimmer shown until image loads */}
          {photo && !imgLoaded && <div className="mls-shimmer" />}

          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt={`${listing.UnparsedAddress}, ${listing.City}`}
              onLoad={() => setImgLoaded(true)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                opacity: imgLoaded ? 1 : 0,
                transition: "opacity 0.4s ease",
                position: "absolute",
                inset: 0,
              }}
            />
          ) : (
            <PlaceholderImage />
          )}

          <span className="mls-badge" style={statusBadgeStyle(listing.StandardStatus)}>
            {listing.StandardStatus}
          </span>
        </div>
        <div className="mls-card-info">
          <div className="mls-price">{formatPrice(listing.ListPrice)}</div>
          <div className="mls-address">
            {listing.UnparsedAddress} · {listing.City}, CO {listing.PostalCode}
          </div>
          <div className="mls-specs">
            {listing.BedroomsTotal != null && <span>{listing.BedroomsTotal} bd</span>}
            {listing.BathroomsTotalInteger != null && <span>{listing.BathroomsTotalInteger} ba</span>}
            {sqft && <span>{formatSqft(sqft)} sqft</span>}
            {listing.LotSizeAcres && <span>{listing.LotSizeAcres.toFixed(2)} ac</span>}
            {listing.GarageSpaces != null && listing.GarageSpaces > 0 && (
              <span>{listing.GarageSpaces}-car garage</span>
            )}
          </div>
        </div>
      </a>

      <style>{`
        .mls-card {
          border-radius: 3px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .mls-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(26,77,26,0.12);
        }
        .mls-card-img {
          height: 220px;
          position: relative;
          overflow: hidden;
          background: #d4e4d4;
        }
        .mls-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #d4e4d4 25%, #e8f0e8 50%, #d4e4d4 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .mls-badge {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          color: #fff;
          font-size: 0.7rem;
          font-family: var(--font-dm-mono), monospace;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.25rem 0.6rem;
          border-radius: 1px;
          z-index: 1;
        }
        .mls-card-info {
          padding: 1.25rem;
          background: #fff;
          border: 1px solid rgba(51,153,51,0.1);
          border-top: none;
        }
        .mls-price {
          font-family: var(--font-fraunces), serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--green-deep);
          margin-bottom: 0.3rem;
        }
        .mls-address {
          font-size: 0.875rem;
          color: #666;
          margin-bottom: 0.75rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mls-specs {
          display: flex;
          gap: 1rem;
          font-family: var(--font-dm-mono), monospace;
          font-size: 0.75rem;
          color: #888;
          flex-wrap: wrap;
        }
        .mls-specs span { white-space: nowrap; }
      `}</style>
    </>
  );
}
