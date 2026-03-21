import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const TILES = [
  {
    href: "/admin/leads",
    icon: "✉",
    label: "Leads",
    description: "Contact form submissions and inquiries",
    status: "live",
  },
  {
    href: "/admin/listings",
    icon: "⌂",
    label: "MLS Listings",
    description: "Monitor live feed, featured homes, status",
    status: "live",
  },
  {
    href: "/admin/content",
    icon: "✎",
    label: "Content",
    description: "Blog posts, market reports, neighborhood guides",
    status: "coming",
  },
  {
    href: "/admin/analytics",
    icon: "◎",
    label: "Analytics",
    description: "Site traffic, search queries, popular listings",
    status: "coming",
  },
  {
    href: "/admin/bhgre",
    icon: "❋",
    label: "BHGRE Connect",
    description: "Sync with Better Homes & Gardens systems",
    status: "coming",
  },
  {
    href: "/admin/agents",
    icon: "◈",
    label: "Agent Roster",
    description: "Neuhaus agents — MLSpy multi-tenant setup",
    status: "coming",
  },
];

export default async function AdminDashboard() {
  const user = await currentUser();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#888",
          marginBottom: "0.4rem",
        }}>
          Welcome back
        </p>
        <h1 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: "var(--green-deep)",
          lineHeight: 1.2,
        }}>
          {user?.firstName ?? "Rich"}
        </h1>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}>
        {TILES.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            style={{
              display: "block",
              background: "#fff",
              border: "1px solid rgba(51,153,51,0.12)",
              borderRadius: "3px",
              padding: "1.5rem",
              textDecoration: "none",
              position: "relative",
              opacity: tile.status === "coming" ? 0.55 : 1,
              pointerEvents: tile.status === "coming" ? "none" : "auto",
              transition: "box-shadow 0.15s, border-color 0.15s",
            }}
          >
            {tile.status === "coming" && (
              <span style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                fontFamily: "var(--font-dm-mono), monospace",
                fontSize: "0.55rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: "rgba(51,153,51,0.08)",
                color: "#aaa",
                padding: "0.2rem 0.5rem",
                borderRadius: "999px",
              }}>
                Soon
              </span>
            )}
            <div style={{ fontSize: "1.4rem", marginBottom: "0.75rem", lineHeight: 1 }}>
              {tile.icon}
            </div>
            <div style={{
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--green-deep)",
              marginBottom: "0.4rem",
              fontWeight: 500,
            }}>
              {tile.label}
            </div>
            <div style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "0.8rem",
              color: "#777",
              lineHeight: 1.5,
            }}>
              {tile.description}
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        a[href]:not([style*="pointer-events: none"]):hover {
          box-shadow: 0 4px 20px rgba(26,77,26,0.1);
          border-color: rgba(51,153,51,0.25) !important;
        }
        @media (max-width: 800px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
