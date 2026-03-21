import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/content", label: "Content" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f8faf8", display: "flex", flexDirection: "column" }}>
      {/* Admin top bar */}
      <header style={{
        background: "var(--green-deep)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "0 2rem",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <Link href="/admin" style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#fff",
            textDecoration: "none",
          }}>
            970.re
          </Link>
          <nav style={{ display: "flex", gap: "0.25rem" }}>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                  textDecoration: "none",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "2px",
                  transition: "background 0.15s, color 0.15s",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/" style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.4)",
            textDecoration: "none",
          }}>
            ← Public site
          </Link>
          <UserButton />
        </div>
      </header>

      <main style={{ flex: 1, padding: "2.5rem 2rem" }}>
        {children}
      </main>
    </div>
  );
}
