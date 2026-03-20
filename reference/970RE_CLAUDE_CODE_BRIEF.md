# 970.re — Claude Code Build Brief
## Project: Northern Colorado Real Estate Website
**Developer:** Rich Kopcho, Broker · Better Homes & Gardens Real Estate Neuhaus  
**Company:** SDK Tech LLC (Wyoming)  
**Domain:** 970.re  
**Stack:** Next.js 14 (App Router) · Tailwind CSS · Vercel  

---

## Mission
Build and deploy a production real estate lead generation website at 970.re. A polished `index.html` prototype is in this folder — use it as the visual and brand reference for all component work.

---

## Phase 1 — GitHub Repo + Next.js Scaffold

1. Initialize a new Next.js 14 project (App Router, TypeScript, Tailwind CSS)
2. Create a GitHub repo named `970re` under the `kopcho` account
3. Push initial scaffold and connect to Vercel for auto-deploy on push
4. Configure custom domain: `970.re` → Vercel

**Vercel project name:** `970re`  
**GitHub org/user:** `kopcho`

---

## Phase 2 — Convert index.html to Next.js Components

Faithfully reproduce the prototype design as React components. Do not redesign — match the index.html exactly.

### Brand System (from index.html — do not change)
```css
--green:       #339933   /* BHGRE primary */
--green-dark:  #1a4d1a   /* headlines, authority */
--green-deep:  #0f2e0f   /* dark backgrounds */
--green-light: #f0f7f0   /* section backgrounds */
--orange:      #ff6b35   /* ALL CTAs */
--orange-dark: #e0541e   /* CTA hover */
--neutral:     #2d2d2d   /* body text */
--white:       #fafdf9   /* page background */
```

### Typography
- **Fraunces** (Google Fonts) — display serif, headlines
- **DM Mono** (Google Fonts) — monospace, labels, wordmark
- **DM Sans** (Google Fonts) — body, nav, UI

### Tagline: "Know the 970."

### Components to build:
| Component | File | Notes |
|-----------|------|-------|
| `<Nav>` | `components/Nav.tsx` | Fixed, blur backdrop, wordmark + links + orange CTA |
| `<Hero>` | `components/Hero.tsx` | Two-column: copy left, market stats card right |
| `<SearchBar>` | `components/SearchBar.tsx` | Dark green bg, white input, orange search button |
| `<ListingsGrid>` | `components/ListingsGrid.tsx` | 3-col responsive grid, accepts listings array |
| `<ListingCard>` | `components/ListingCard.tsx` | Image, badge, price, address, specs |
| `<ValueProps>` | `components/ValueProps.tsx` | Two-col: copy left, 2x2 card grid right |
| `<CTAStrip>` | `components/CTAStrip.tsx` | Dark bg, home valuation CTA |
| `<Footer>` | `components/Footer.tsx` | Wordmark, broker info, equal housing |

### Pages:
- `/` — Home (all sections stacked)
- `/search` — Stub page (placeholder for Phase 3)
- `/valuation` — Stub page (lead capture form, placeholder for Phase 3)
- `/about` — Stub page

### Animations
Preserve the `fadeUp` staggered entrance animations from index.html. Use Tailwind + CSS keyframes or Framer Motion.

---

## Phase 3 — MLS Search Integration

Wire the `/search` page to live IRES MLS data via the **970re MCP server** (built separately under SDK Tech LLC).

### Data source
- **API:** Spark API (MLS Grid) — credentials under SDK Tech LLC (user: SDKTECH)
- **MCP server:** 970re MCP server (to be running locally or deployed separately)
- The search bar on the home page should route to `/search?q={query}`

### Search page behavior
- Natural language input → MLS query
- Results display as `<ListingCard>` grid
- Filters: price range, beds/baths, city, property type
- Each card links to `/listing/[mlsId]` detail page (Phase 3b)

### Stub implementation for now
- `/search` renders a "Coming Soon — MLS Search Powered by MLSpy" message with email capture
- Wire up live data once MCP server is confirmed running

---

## Phase 4 — Lead Capture

### Home valuation page (`/valuation`)
- Form: name, email, phone, property address
- Submit → write to Neon database (or email via Resend)
- Confirmation message on submit

### Contact / general leads
- Floating "Talk to Rich" button (bottom right, mobile-friendly)
- Routes to `/contact` or opens a modal

---

## Environment Variables Needed
```
NEXT_PUBLIC_SITE_URL=https://970.re
MCP_SERVER_URL=        # 970re MCP server endpoint (Phase 3)
NEON_DATABASE_URL=     # lead capture (Phase 4)
RESEND_API_KEY=        # email notifications (Phase 4)
```

---

## Deployment Checklist
- [ ] GitHub repo created: `kopcho/970re`
- [ ] Vercel project connected to repo
- [ ] Custom domain `970.re` pointed at Vercel
- [ ] `index.html` preserved in `/reference/` folder (do not delete)
- [ ] All Google Fonts loading via `next/font` (not CDN link)
- [ ] Mobile responsive (matches index.html breakpoints)
- [ ] Lighthouse score > 90

---

## Important Notes
- **SDK Tech LLC** is the vendor/developer entity for all API registrations
- **Rich Kopcho** is the authorizing broker for MLS access
- The MLS search layer (MLSpy) is a separate SaaS product — do not expose its branding on 970.re
- Keep the site focused on lead gen: search, value, contact. No blog, no market reports yet.
- Orange (#ff6b35) for ALL call-to-action buttons. No exceptions.

---

## First Command
Start with Phase 1: scaffold the Next.js project, init the GitHub repo, and get a bare deploy live on Vercel. Then confirm before moving to Phase 2.
