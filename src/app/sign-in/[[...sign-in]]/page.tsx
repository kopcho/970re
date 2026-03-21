import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--green-deep)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <div>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{
            fontFamily: "var(--font-fraunces), serif",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.01em",
          }}>
            970.re Admin
          </p>
          <p style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.45)",
            marginTop: "0.4rem",
          }}>
            Rich Kopcho · Broker Dashboard
          </p>
        </div>
        <SignIn fallbackRedirectUrl="/admin" />
      </div>
    </main>
  );
}
