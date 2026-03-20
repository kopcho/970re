import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--white)",
        padding: "8rem 2rem 6rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "680px", width: "100%" }}>
        <p
          style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.75rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--green)",
            marginBottom: "1.5rem",
          }}
        >
          About
        </p>

        <h1
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "clamp(2.5rem, 5vw, 4rem)",
            fontWeight: 900,
            color: "var(--green-deep)",
            marginBottom: "0.5rem",
            lineHeight: 1.05,
          }}
        >
          Rich{" "}
          <em
            style={{
              fontStyle: "italic",
              fontWeight: 300,
              color: "var(--green)",
            }}
          >
            Kopcho
          </em>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.3rem",
            fontWeight: 300,
            fontStyle: "italic",
            color: "var(--green-dark)",
            marginBottom: "2.5rem",
            opacity: 0.85,
          }}
        >
          Broker · Better Homes &amp; Gardens Real Estate Neuhaus
        </p>

        <div
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.8,
            color: "#4a5a4a",
          }}
        >
          <p style={{ marginBottom: "1.5rem" }}>
            Rich Kopcho has spent 50 years in Northern Colorado.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            As a broker with Better Homes &amp; Gardens Real Estate Neuhaus, Rich brings a combination of deep local knowledge and modern technology to every transaction. That means knowing which streets flood in spring, where the hidden gems are before they hit the market, and what a home is actually worth — not just what an algorithm says.
          </p>
          <p style={{ marginBottom: "2.5rem" }}>
            Whether you&apos;re buying your first home, selling a long-held property, or building an investment portfolio in NoCo, Rich is the guide you want in your corner.
          </p>
        </div>

        <Link
          href="/contact"
          style={{
            background: "var(--orange)",
            color: "#fff",
            border: "none",
            padding: "1rem 2rem",
            fontFamily: "var(--font-dm-sans), sans-serif",
            fontSize: "0.95rem",
            fontWeight: 500,
            letterSpacing: "0.02em",
            cursor: "pointer",
            borderRadius: "2px",
            textDecoration: "none",
            display: "inline-block",
            marginRight: "1rem",
            marginBottom: "1rem",
          }}
        >
          Get in Touch →
        </Link>

        <Link
          href="/"
          style={{
            fontSize: "0.875rem",
            color: "var(--green)",
            textDecoration: "none",
            borderBottom: "1px solid var(--green)",
            paddingBottom: "1px",
            display: "inline-block",
            marginBottom: "1rem",
          }}
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
