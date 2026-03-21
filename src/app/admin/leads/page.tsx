import { neon } from "@neondatabase/serverless";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  property?: string;
  created_at: string;
}

async function getLeads(): Promise<Lead[]> {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const rows = await sql`
      SELECT id, name, email, phone, message, property, created_at
      FROM contacts
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return rows as Lead[];
  } catch {
    return [];
  }
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem", display: "flex", alignItems: "baseline", gap: "1rem" }}>
        <h2 style={{
          fontFamily: "var(--font-fraunces), serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--green-deep)",
        }}>Leads</h2>
        <span style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.7rem",
          color: "#888",
          letterSpacing: "0.08em",
        }}>
          {leads.length} total
        </span>
      </div>

      {leads.length === 0 ? (
        <div style={{
          background: "#fff",
          border: "1px solid rgba(51,153,51,0.12)",
          borderRadius: "3px",
          padding: "4rem",
          textAlign: "center",
          color: "#aaa",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.8rem",
          letterSpacing: "0.08em",
        }}>
          No leads yet — they&apos;ll appear here when someone submits the contact form.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {leads.map((lead) => (
            <div key={lead.id} style={{
              background: "#fff",
              border: "1px solid rgba(51,153,51,0.12)",
              borderRadius: "3px",
              padding: "1.25rem 1.5rem",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
                <div>
                  <span style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--green-deep)",
                  }}>
                    {lead.name}
                  </span>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
                    <a href={`mailto:${lead.email}`} style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: "0.72rem",
                      color: "var(--green)",
                      textDecoration: "none",
                      letterSpacing: "0.04em",
                    }}>
                      {lead.email}
                    </a>
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} style={{
                        fontFamily: "var(--font-dm-mono), monospace",
                        fontSize: "0.72rem",
                        color: "#888",
                        textDecoration: "none",
                      }}>
                        {lead.phone}
                      </a>
                    )}
                  </div>
                </div>
                <span style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.65rem",
                  color: "#bbb",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}>
                  {new Date(lead.created_at).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit"
                  })}
                </span>
              </div>

              {lead.property && (
                <div style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--orange)",
                  marginBottom: "0.5rem",
                }}>
                  Re: {lead.property}
                </div>
              )}

              <p style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "0.85rem",
                color: "#555",
                lineHeight: 1.6,
                margin: 0,
              }}>
                {lead.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
