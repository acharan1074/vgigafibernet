# Rudra Fiber Net

Full-stack futuristic ISP broadband website for RUDRA FIBER NET — a fiber internet and cable TV provider in Andhra Pradesh & Telangana.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/rudra-fiber run dev` — run the frontend (port 25867)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/db run seed` — seed plans data
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, Orbitron font, glassmorphism/neon UI
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rudra-fiber/` — React frontend (Vite, Tailwind, Framer Motion)
  - `src/pages/` — Home, Plans, BookConnection, Login, Portal, SpeedTest, Contact, Admin, NotFound
  - `src/components/` — Navbar, Footer, WhatsAppButton, ThemeProvider
  - `src/index.css` — Deep navy/gold/cyan theme, glassmorphism, neon utilities
- `artifacts/api-server/src/routes/` — Express route handlers (plans, connections, auth, customers, complaints, admin)
- `lib/db/src/schema/` — Drizzle ORM schemas (plans, connections, customers, complaints)
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)
- `lib/api-client-react/src/generated/` — Generated React Query hooks
- `lib/api-zod/src/generated/` — Generated Zod validation schemas

## Architecture decisions

- Contract-first API design: OpenAPI spec → Orval codegen → typed React Query hooks + Zod validators
- OTP auth is demo-only (in-memory store, fixed OTP 123456); in production integrate an SMS gateway
- Admin panel uses client-side password gate only (demo password: rudra2024); production should use proper auth
- Plans are seeded via `pnpm --filter @workspace/db run seed`
- Frontend uses fallback/hardcoded data when API is unavailable (plans page shows defaults)

## Product

- **Homepage**: Animated fiber hero, speed plan cards, features grid, 1000+ Telugu TV channels browser, OTT showcase, CTA
- **Plans page**: Filter by SD TV / HD TV / Internet Only; buy/recharge buttons for each plan
- **Book Connection**: 3-step multi-page form (personal info → address → plan selection)
- **Login**: OTP-based login (+91 mobile → 6-digit OTP; demo OTP: 123456)
- **Customer Portal**: Data usage chart, weekly usage bar chart, support ticket creation
- **Speed Test**: Animated SVG gauges for download/upload/ping with simulated test
- **Contact**: Helpline number 9640840216, WhatsApp/Telegram/Email links, contact form
- **Admin Dashboard** (password: rudra2024): Stats cards, revenue chart, connections/customers/complaints management tables

## User preferences

- Support phone: 9640840216 / WhatsApp: wa.me/919640840216
- Color palette: background hsl(222 47% 8%), primary/gold hsl(38 92% 50%), accent/cyan hsl(185 100% 50%)
- Font: Orbitron (display/headings) + Inter (body)
- Service area: Andhra Pradesh & Telangana

## Gotchas

- The frontend falls back to hardcoded plan data if the API returns empty; always seed the DB first
- OTP is stored in-memory on the API server — restarts clear all pending OTPs
- Admin auth is session-storage based; clears on tab close
- Do not run `pnpm dev` at workspace root — use workflows or `--filter`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
