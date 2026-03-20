# 970.re / MLSpy — Product Vision
**Last updated:** 2026-03-20
**Owner:** Rich Kopcho · SDK Tech LLC

---

## What This Is

970.re starts as Rich Kopcho's personal real estate website but is the **pilot deployment** of a multi-tenant SaaS platform for real estate agents and brokerages. The underlying product is **MLSpy** — an AI-powered MLS search and lead generation platform built on the 970re MCP server.

The 20+ agents at Better Homes & Gardens Real Estate — Neuhaus (Loveland, CO) are the first paying/pilot cohort.

---

## The Product Model

### Tenant = Agent or Brokerage
Each tenant gets:
- Their own branded site (subdomain or custom domain)
- Their own lead pipeline (isolated DB rows by `tenant_id`)
- MLS search powered by the 970re MCP server (Spark API / IRES)
- AI-powered natural language home search
- Lead capture forms → SMS/email notifications
- Dashboard to manage leads

### Pilot Path
1. Rich's personal site (`970.re`) → proves the stack
2. Neuhaus office deploys for all 20+ agents → validates multi-tenant
3. Open to any agent/brokerage → full SaaS launch

---

## Architecture Implications (Build Toward These)

### Multi-Tenancy
- Add `tenant_id` to all DB tables from the start
- Auth layer: agents log in, see only their leads
- Tenant config: name, domain, phone, brokerage, colors (brand overrides)
- Admin role: broker/office manager sees all agents in their brokerage

### Auth
- Next-Auth or Clerk for agent authentication
- Roles: `super_admin` (SDK Tech), `broker_admin` (office manager), `agent` (individual)

### Payments / Subscriptions
- Stripe for subscription billing
- Plans TBD — likely per-agent/seat or per-brokerage
- Free tier: Rich / Neuhaus pilot (comped)
- Metered usage consideration: MLS API calls, AI queries

### MCP Server Integration (Phase 3)
- 970re MCP server connects to Spark API (MLS Grid) via SDK Tech LLC credentials
- Each tenant queries through the shared MCP server
- Rate limiting and usage tracking per tenant

### Database Schema Evolution
Current `leads` table needs `tenant_id`. Future tables:
- `tenants` — account, plan, domain, config
- `users` — agents, linked to tenant
- `leads` — with `tenant_id`, `agent_id`
- `listings` — cached MLS data per search
- `subscriptions` — Stripe subscription state

---

## Current Stack (Phase 1-4)
- **Frontend:** Next.js 14 App Router · TypeScript · Tailwind CSS
- **Database:** Neon (serverless Postgres) via Vercel integration
- **Hosting:** Vercel (auto-deploy on push)
- **Notifications:** Resend → Verizon SMS gateway
- **DNS:** Vercel nameservers
- **Repo:** github.com/kopcho/970re

## Stack to Add
- **Auth:** Clerk (recommended for multi-tenant, has org/team support)
- **Payments:** Stripe (subscriptions + usage billing)
- **MCP:** 970re MCP server (built separately under SDK Tech LLC)
- **Email:** Resend (already in, expand to transactional email)
- **Analytics:** Vercel Analytics (already available, enable)

---

## Phases Recap

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Next.js scaffold + GitHub + Vercel deploy | ✅ Done |
| 2 | Convert HTML prototype → React components | ✅ Done |
| 3 | MLS search via 970re MCP server | 🔲 Pending MCP server |
| 4 | Lead capture → Neon DB + SMS notifications | ✅ Done |
| 5 | Auth (Clerk) + agent dashboard | 🔲 Next |
| 6 | Multi-tenancy (tenant_id, agent accounts) | 🔲 Future |
| 7 | Stripe subscriptions | 🔲 Future |
| 8 | Neuhaus pilot (20+ agents) | 🔲 Future |
| 9 | Open SaaS launch | 🔲 Future |

---

## Notes
- MLSpy branding is the SaaS product — do NOT expose on 970.re (per original brief)
- SDK Tech LLC is the vendor entity for all API registrations and billing
- Rich is the authorizing broker for MLS access
- Neuhaus pilot is both a proof of concept and a revenue event
