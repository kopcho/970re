export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a1a0a",
        padding: "3rem 5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
      className="footer-responsive"
    >
      <div
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "1.4rem",
          fontWeight: 500,
          color: "#fff",
          letterSpacing: "-0.04em",
        }}
      >
        970<span style={{ color: "var(--green)" }}>.re</span>
      </div>

      <div
        style={{
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.35)",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        © 2025 970.re · Rich Kopcho, Broker<br />
        Better Homes &amp; Gardens Real Estate Neuhaus · Loveland, CO
      </div>

      <div
        style={{
          fontSize: "0.75rem",
          color: "rgba(255,255,255,0.3)",
          textAlign: "right",
          lineHeight: 1.5,
        }}
      >
        Licensed in Colorado<br />
        Equal Housing Opportunity
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-responsive {
            flex-direction: column !important;
            gap: 1rem !important;
            text-align: center !important;
            padding: 2rem !important;
          }
          .footer-responsive > div {
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
}
