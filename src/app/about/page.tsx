import Link from "next/link";
import Image from "next/image";

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
        <Image
          src="/images/rich-kopcho.jpg"
          alt="Rich Kopcho, Broker — Better Homes & Gardens Real Estate Neuhaus, Loveland CO"
          width={680}
          height={400}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "3px",
            marginBottom: "2.5rem",
            objectFit: "cover",
            objectPosition: "center top",
          }}
          priority
        />

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
            I&apos;ve called Northern Colorado home for 50 years. I&apos;ve watched Loveland grow from a quiet agricultural town into one of the most desirable communities on the Front Range — and I&apos;ve seen every market cycle, every neighborhood shift, and every hidden gem along the way.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            That&apos;s what I bring to every transaction. Not just the data — anyone can pull the data — but the context behind it. Which streets flood in a wet spring. Where the values are quietly climbing before the listings reflect it. What the 970 actually feels like to live in, raise a family in, grow a business in.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            Over the years I&apos;ve built multiple businesses, worked alongside major employers in the region, and learned how decisions — financial, strategic, personal — actually get made. Real estate is where all of that comes together.
          </p>
          <p style={{ marginBottom: "2.5rem" }}>
            I&apos;m a licensed broker with Better Homes &amp; Gardens Real Estate — Neuhaus in Loveland. If you&apos;re buying, selling, or just trying to understand this market — let&apos;s talk.
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
