# 970.re / MLSpy — Master Project Context
**Last updated:** 2026-03-20
**Owner:** Rich Kopcho · SDK Tech LLC (Wyoming)
**For:** Claude Code — read this before touching anything in this repo

---

## Who Rich Is

Rich Kopcho is a licensed real estate broker with **Better Homes & Gardens Real Estate — Neuhaus** in Loveland, Colorado. He has lived in Northern Colorado for **50 years** — that local depth is the core brand differentiator, not transaction count. He is also a serial entrepreneur who has built multiple businesses and worked alongside major employers in the region. Real estate is where all of that comes together.

**Entities:**
- **SDK Tech LLC** (Wyoming) — the developer/vendor entity for all API registrations, billing, and tech infrastructure
- **Rich Kopcho** — authorizing broker for all MLS access
- **BHGRE — Neuhaus** — brokerage affiliation (note the hyphen before Neuhaus — always)

**Contact / identifiers:**
- Domain: `970.re`
- Email: `rich@970.re` (live)
- Phone: `(970) 669-8677`
- Brokerage: Better Homes & Gardens Real Estate — Neuhaus, Loveland CO
- MLS API user: `SDKTECH` (Spark API / MLS Grid)

---

## The Brand

### Voice
Local expert. Honest. No pressure. Data-backed. Never generic. Rich knows the 970 because he's lived it for 50 years — not because he has a license.

### Tagline
**"Know the 970."**

### One-liner (hero subheadline)
*50 years in the 970. Built businesses here. Now helping others put down roots.*

### Bio (approved copy — use exactly)
> I've called Northern Colorado home for 50 years. I've watched Loveland grow from a quiet agricultural town into one of the most desirable communities on the Front Range — and I've seen every market cycle, every neighborhood shift, and every hidden gem along the way.
>
> That's what I bring to every transaction. Not just the data — anyone can pull the data — but the context behind it. Which streets flood in a wet spring. Where the values are quietly climbing before the listings reflect it. What the 970 actually feels like to live in, raise a family in, grow a business in.
>
> Over the years I've built multiple businesses, worked alongside major employers in the region, and learned how decisions — financial, strategic, personal — actually get made. Real estate is where all of that comes together.
>
> I'm a licensed broker with Better Homes & Gardens Real Estate — Neuhaus in Loveland. If you're buying, selling, or just trying to understand this market — let's talk.

### Brand Colors (do not change)
```css
--green:       #339933   /* BHGRE primary */
--green-dark:  #1a4d1a   /* headlines, authority */
--green-deep:  #0f2e0f   /* dark backgrounds */
--green-light: #f0f7f0   /* section backgrounds */
--orange:      #ff6b35   /* ALL CTAs — no exceptions */
--orange-dark: #e0541e   /* CTA hover */
--neutral:     #2d2d2d   /* body text */
--white:       #fafdf9   /* page background */
```

### Typography
- **Fraunces** — display serif, headlines
- **DM Mono** — monospace, labels, wordmark
- **DM Sans** — body, nav, UI

### Real Market Stats (Larimer County — current as of March 2026)
```
Median Sale Price:     $549K
Avg Days on Market:    18
List-to-Sale Ratio:    99%
Active Listings:       2,700+
```
Source: Orchard / MLS data March 2026. Update monthly.

---

## What 970.re Is (The Full Picture)

970.re starts as Rich's personal real estate website but is the **pilot deployment** of a multi-tenant SaaS platform. The underlying product is **MLSpy** — an AI-powered MLS search and lead generation platform. The 20+ agents at BHGRE — Neuhaus are the first pilot cohort.

**Critical:** MLSpy branding must NEVER appear on 970.re. 970.re is the client-facing brand. MLSpy is the SaaS infrastructure underneath.

---

## Current Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Frontend | Next.js 14 App Router · TypeScript · Tailwind | App Router only — no Pages Router |
| Database | Neon (serverless Postgres) via Vercel integration | `DATABASE_URL` env var |
| Hosting | Vercel (auto-deploy on push to main) | Project: `970re` |
| Notifications | Resend → Verizon SMS gateway | Lead alerts to `(970) 669-8677` via `9706698677@vtext.com` |
| DNS | Vercel nameservers | Domain: 970.re |
| Repo | github.com/kopcho/970re | |

### Stack to Add (in order)
1. **Clerk** — auth for agent dashboard (has org/team support, right for multi-tenant)
2. **Stripe** — subscription billing (per-agent seat or per-brokerage)
3. **970re MCP server** — built separately under SDK Tech LLC, connects to Spark API

---

## Phase Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Next.js scaffold + GitHub + Vercel deploy | ✅ Done |
| 2 | Convert HTML prototype → React components | ✅ Done |
| 3 | MLS search — direct API + AI search + MCP server | ✅ Done |
| 4 | Lead capture → Neon DB + SMS notifications | ✅ Done |
| 5 | Mobile hamburger nav + floating Talk to Rich button | ✅ Done |
| 6 | SEO / GEO / AEO — sitemap, robots, JSON-LD, llms.txt, OG image | ✅ Done |
| 7 | Auth (Clerk) + agent dashboard | 🔲 Next |
| 8 | Multi-tenancy (tenant_id, agent accounts) | 🔲 Future |
| 9 | Stripe subscriptions | 🔲 Future |
| 10 | Neuhaus pilot — 20+ agents | 🔲 Future |
| 11 | Open SaaS launch | 🔲 Future |

---

## Phase 3 — MLS Search (Complete)

### Data Source
- **API:** MLS Grid demo BBO (IRES feed) — `https://api-demo.mlsgrid.com/v2`
- **Key:** `MLS_GRID_API_KEY` env var
- **Coverage:** IRES MLS (Northern Colorado) — 46 active listings in demo, predominantly NoCo
- **Production:** Swap `api-demo.mlsgrid.com` → `api.mlsgrid.com` when full subscription activates

### Architecture

```
/search page (Next.js client)
  ├── AI Search tab → POST /api/ai-search → Claude Haiku (tool use) → MLS Grid API
  └── Filter tab   → GET /api/listings → MLS Grid API → filter server-side

mcp/server.ts (stdio MCP server for Claude Desktop / Claude Code)
  ├── search_listings
  ├── get_corridor_cities
  └── get_listing_details
```

### Key files
- `src/lib/mls.ts` — MLSListing type, fetchMLSListings(), formatters
- `src/lib/corridors.ts` — geographic corridor → city mappings + NOCO_GEOGRAPHY string
- `src/app/api/ai-search/route.ts` — Claude Haiku + tool use → MLS results + summary
- `src/app/api/listings/route.ts` — structured filter search
- `src/components/MLSListingCard.tsx` — listing card with real photos
- `src/components/FeaturedListings.tsx` — async server component, home page featured
- `mcp/server.ts` — standalone MCP server (stdio transport)

### Natural Language Examples (AI Search)
- "3bd 2ba with 3-car garage and 5 acres along I-25" → GarageSpaces≥3, LotSizeAcres≥5, I-25 corridor cities
- "Find a repo yard with outdoor storage near Loveland" → acres + garage + keywords
- "Investment property near CSU" → Fort Collins, price-relative search

### MCP Server — connecting to Claude
```bash
# Claude Code (global)
claude mcp add 970re-mls node C:/Users/rich/projects/970re/mcp/dist/server.js \
  --env MLS_GRID_API_KEY=<key>

# Claude Desktop — add to claude_desktop_config.json (see mcp/README.md)
```

---

## The Virtual Sculpture Tour (Major Content Asset)

Lives at `970.re/loveland-sculpture-tour`. Will be the most comprehensive digital documentation of the Benson Sculpture Garden ever produced.

### Why It Matters
- Loveland is the **Sculpture Capital of the World** — home to the Benson Sculpture Garden (189 sculptures dating to 1985) and Sculpture in the Park (largest juried sculpture show in the US)
- No real estate website has ever leveraged this. National portals ignore it entirely.
- 189 individual sculpture entries = 189 SEO/AEO content nodes
- AI answer engines (ChatGPT, Perplexity, Google) will cite this as the authoritative Loveland resource
- Positions Rich as a Loveland cultural ambassador, not just a transaction agent

### Photography Partnership
- **Photographer:** Rich's mentee, runs **CleanCapture.us** — drone + ground photography
- **Deal structure:** No fee — CleanCapture gets a permanent dofollow backlink on every tour page
- **Credit line on every page:** "Aerial & ground photography by [Name] · CleanCapture.us · Northern Colorado real estate photography"
- **Scope:** Full walk-around of every Benson Garden sculpture (4–6 shots each + drone), then citywide pieces

### Sculpture Data
- **Benson Park:** 189 sculptures (official city list, 1985–2025)
- **Citywide Loveland:** 19 additional placed works with locations
- **Total:** 208 pieces across both collections
- Source files: `Benson_Park_Sculptures.xlsx` and `Sculputres_Citywide.xlsx` (in project folder, gitignored — do not commit)

### Virtual Tour Page Structure (`/loveland-sculpture-tour`)
```
- Hero: Aerial of Benson Garden + headline "Loveland: Sculpture Capital of the World"
- Intro: 150-word overview of Loveland's sculpture identity
- Interactive map: All sculpture locations (Mapbox or Google Maps)
- Gallery grid: Photo, title, artist, year, medium, short description per sculpture
- "Neighborhoods Near the Sculptures" → links to listing searches
- CTA: "Thinking about living near the sculpture trail? Talk to Rich."
```

### Schema Per Sculpture
```json
{
  "@type": "TouristAttraction",
  "name": "[Sculpture Title]",
  "description": "[2-3 sentences]",
  "geo": { "latitude": "...", "longitude": "..." },
  "image": "...",
  "creator": { "@type": "Person", "name": "[Artist]" }
}
```

---

## Content Strategy (SEO + AEO)

| Priority | Title | Notes |
|----------|-------|-------|
| 1 | Loveland Sculpture Capital: Virtual Tour | Biggest SEO/AEO asset |
| 2 | Weld vs Larimer County: Property Tax Truth 2026 | High local search intent |
| 3 | Metro Districts vs HOAs: What Nobody Tells You | High local search intent |
| 4 | Moving to Loveland CO: The Real Insider Guide | AI will cite this |
| 5 | Best Neighborhoods in Fort Collins for Families | Blog format |

### AEO Formula (every content page)
1. Open with H2 question + 2-sentence direct answer above the fold
2. At least one data table with local-specific numbers
3. Reference specific local entities (Larimer County Assessor, PSD, CDOT)
4. End with 4–6 FAQ pairs (pulled directly by AI engines)
5. Rich's 50-year local POV must be audible — never generic

---

## Environment Variables

```bash
# Live now
NEXT_PUBLIC_SITE_URL=https://970.re
DATABASE_URL=             # Neon Postgres (set in Vercel + .env.local)
RESEND_API_KEY=           # Email/SMS notifications (set in Vercel + .env.local)
NEXT_PUBLIC_GOOGLE_MAPS_KEY=  # Address geocoding (set in Vercel + .env.local)
MLS_GRID_API_KEY=         # MLS Grid BBO API key (set in Vercel + .env.local)
ANTHROPIC_API_KEY=        # Claude API for AI search (set in Vercel + .env.local)

# Phase 7+
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## Important Rules (Never Violate These)

1. **MLSpy branding never appears on 970.re** — 970.re is the client brand
2. **SDK Tech LLC** is the vendor/developer entity for all API registrations
3. **Rich Kopcho** is the authorizing broker for MLS access
4. **Orange (#ff6b35) for ALL CTAs** — no exceptions
5. **BHGRE — Neuhaus** — always hyphen before Neuhaus
6. **Bio copy is approved** — use exactly as written above, do not paraphrase

---

## Files in /reference

| File | Purpose |
|------|---------|
| `index.html` | Original design prototype — visual reference, do not delete |
| `970RE_CLAUDE_CODE_BRIEF.md` | Original build brief |
| `PRODUCT_VISION.md` | SaaS architecture and phase overview |
| `MASTER_CONTEXT.md` | This file — source of truth |

*Sculpture data files (.xlsx) are in the project folder but gitignored — do not commit.*

---

*This document is the source of truth for all 970.re decisions. When in doubt, check here first.*
